;; UniswapV2Pair.sol
;; UniswapV2Factory.sol

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Traits
;; Basic Fungible Token Trait
(use-trait ft-trait .sip-010-trait-ft-standard.sip-010-trait)
;; Fungible Token Trait + Mint and Burn
(use-trait ft-plus-trait .ft-plus-trait.ft-plus-trait)
;; Don't fully understand this
(use-trait send-revenue-trait .token-mngr-trait.send-revenue-trait)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Errors
(define-constant err-auth (err u100))
(define-constant err-check-owner (err u101))
(define-constant err-no-such-pool (err u102))
(define-constant err-create-preconditions (err u103))
(define-constant err-create-postconditions (err u104))
(define-constant err-mint-preconditions (err u105))
(define-constant err-mint-postconditions (err u106))
(define-constant err-burn-preconditions (err u107))
(define-constant err-burn-postconditons (err u108))
(define-constant err-swap-preconditions (err u109))
(define-constant err-swap-postconditions (err u110))
(define-constant err-collect-preconditions (err u111))
(define-constant err-collect-postconditions (err u112))
(define-constant err-anti-rug (err u113))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Ownership
;; Variable to define the contract owner, initially set to the tx-sender
(define-data-var owner principal tx-sender)
;; Read only to get the owner
(define-read-only (get-owner) 
  (var-get owner)
)
;; Private function to check if owner is-eq to tx-sender (this is just adding to the read counts)
(define-private (check-owner)
  (ok (asserts! (is-eq tx-sender (get-owner)) err-check-owner))
)
;; Public function to set the new owner variable (would suggest using let instead of begin)
(define-public (set-owner (new-owner principal))
  (begin
    (try! (check-owner))
    (ok (var-set owner new-owner))
  )
)

;; new variable to set who to send the fee to, initially set to the tx-sender
(define-data-var fee-to principal tx-sender)
;; Read only to get the principal receiving the fee
(define-read-only (get-fee-to) 
  (var-get fee-to)
)
;; Private function to check if the tx-sender is-eq to the fee-to address
(define-private (check-fee-to)
  (ok (asserts! (is-eq tx-sender (get-fee-to)) err-auth))
)
;; Public function to set the new fee-to address
(define-public (set-fee-to (new-fee-to principal))
  (begin
    (try! (check-owner))
    (ok (var-set fee-to new-fee-to)) 
  )
)

;; NOTE: tx-sender does not implement trait... 
;; new variable to set the rev-share to a principal, initially the tx-sender
(define-data-var rev-share principal tx-sender)
;; Read only to get the address rev-share
(define-read-only (get-rev-share) 
  (var-get rev-share)
)
;; Public function to set the new rev-share
(define-public (set-rev-share (new-rev-share principal))
  (begin
    (try! (check-owner))
    (ok (var-set rev-share new-rev-share)) 
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Storage
;; Defining a new var pool-id to a uint initially u0
(define-data-var pool-id uint u0)
;; Private function to set the pool-id to the next uint by adding u1
(define-private (next-pool-id)
  (let 
    (
      (id  (var-get pool-id))
      (nxt (+ id u1))
    )
    (var-set pool-id nxt)
    nxt
  )
)
;; Read only to get the number of pools (nr) 
(define-read-only (get-nr-pools) (var-get pool-id))

;; Defining a map with a uint as a key, that contains all the information a specific pool
(define-map pools uint
  {
    symbol: (string-ascii 65),
    token0: principal,
    token1: principal,
    lp-token: principal,
    reserve0: uint,
    reserve1: uint,
    swap-fee: (tuple (num uint) (den uint)), ;;fraction of input
    protocol-fee: (tuple (num uint) (den uint)), ;;fraction of swap fee
    share-fee: (tuple (num uint) (den uint)), ;;fraction of protocol fee
    block-height: uint, ;;last
    burn-block-height: uint, ;;updated
  }
)

;; Map to track the index of a pair, takes 2 tokens as key values and returns a uint
(define-map index 
  {
    token0: principal, token1: principal
  }
  uint
)

;; Set of known lp-tokens
;; Map to track if an lp token is true or false
(define-map lp-tokens principal bool)

;; Map to track the revenue of a pool in each token, takes a uint as key and returns 2 uints
(define-map revenue
  uint
  {
    token0: uint,
    token1: uint,
  }
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Read
;; Gets the map for a pool 
(define-read-only (get-pool (id uint))
  (map-get? pools id)
)

;; This is repetitive, doesn't makes sense to have this, using unwrap-panic
(define-read-only (do-get-pool (id uint))
  (unwrap-panic (get-pool id))
)

;; Read only to get the pool id of a pair of tokens
(define-read-only (get-pool-id (token0 principal) (token1 principal))
  (map-get? index {token0: token0, token1: token1})
)

;; Read only to check if a pool is either token0 - token1 or token1 - token0, if it is neither it returns none
(define-read-only (lookup-pool (token0 principal) (token1 principal))
  (match (get-pool-id token0 token1)
    id (some {pool: (do-get-pool id), flipped: false})
    (match (get-pool-id token1 token0)
      id (some {pool: (do-get-pool id), flipped: true})
      none
    )
  )
)

;; Read only to get the revenue map of a given pool, using unwrap-panic
(define-read-only (do-get-revenue (id uint))
  (unwrap-panic (map-get? revenue id))
)

;; Read only to get information about the fee and guard (MAX-SWAP-FEE) to see if fee is bigger or equal than MAX
(define-read-only (check-fee (fee (tuple (num uint) (den uint))) (guard (tuple (num uint) (den uint))))
  (let 
    (
      (amt  u1000000)
      ;; Calculated by multiplying "amt" with the numerator of the "fee" and dividing it by the denominator of the "fee"
      (amt1 (/ (* amt (get num fee)) (get den fee)))
      ;; Calculated by multiplying "amt" with the numerator of the "guard" and dividing it by the denominator of the "guard"
      (amt2 (/ (* amt (get num guard)) (get den guard)))
    )
    ;; Checks if the "amt1" is greater than or equal to "amt2", returns true or false
    (>= amt1 amt2)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Write
;; Defines the max swapp fee, with numerator 995 and denominator 1000 (995/1000 = .995) 
(define-constant MAX-SWAP-FEE {num: u995, den: u1000})

;; Public function to update the swap-fee of a specific pool 
(define-public (update-swap-fee (id uint) (fee (tuple (num uint) (den uint))))
  (let 
    (
      (pool (do-get-pool id))
    )
    ;; Checks if tx-send is-eq to owner
    (try! 
      (check-owner)
    )
    ;; Asserts that the new fee is equal or greater than MAX-SWAP-FEE
    (asserts! (check-fee fee MAX-SWAP-FEE) err-anti-rug)

    (ok 
      ;; Updated the value of fee in the given pool
      (map-set pools id (merge pool {swap-fee: fee}))
    )
  )
)

;; Updates protocol-fee for a specified pool
(define-public (update-protocol-fee (id uint) (fee (tuple (num uint) (den uint))))
  (let 
    (
      (pool (do-get-pool id))
    )
    ;; Checks if tx-sender is owner
    (try! (check-owner))
    (ok 
      ;; Updates the protocol-fee values
      (map-set pools id (merge pool {protocol-fee: fee}))
    )
  )
)

;; Updates the share-fee for a specified pool
(define-public (update-share-fee (id uint) (fee (tuple (num uint) (den uint))))
  (let 
    (
      (pool (do-get-pool id))
    )
    ;; Checks if tx-sender is owner
    (try! (check-owner))
    (ok 
      ;; Updated the share-fee values
      (map-set pools id (merge pool {share-fee: fee}))
    )
  )
)

;; Updates reserves of an existing pool.
(define-private (update-reserves (id uint) (r0 uint) (r1 uint))
  (let 
    (
      (pool (do-get-pool id))
    )
    (ok 
      ;; Updates the reserve0, reserve1, blockheight and burn-block-height of the specified pool
      (map-set pools id 
        (merge pool 
          {
            reserve0: r0,
            reserve1: r1,
            block-height: block-height,
            burn-block-height: burn-block-height,
          }
        )
      ) 
    )
  )
)

;; Private function that updates the revenue map of a given pair/pool, only on one token wether its token-0 or not
(define-private (update-revenue (id uint) (is-token0 bool) (amt uint))
  (let 
    (
      ;; Fetch the revenue map of the pair/pool
      (r0  (do-get-revenue id))
      ;; Extract value of token0 from the map
      (t0r (get token0 r0))
      ;; Extract value of token1 from the map
      (t1r (get token1 r0))
      ;; Creates the new data to update the map
      (r1 {
            ;; if is-token0 is true update t0r + amt if not leave the same
            token0: (if is-token0 (+ t0r amt) t0r),
            ;; if is-token0 is true leave the same if not update t1r + amt
            token1: (if is-token0 t1r (+ t1r amt)) 
          }
      ) 
    )
    (ok 
      ;; sets with the new information
      (map-set revenue id r1)
    ) 
  )
)

;; Reset the map to u0 for both token0 and token1 of a given pair/pool
(define-private (reset-revenue (id uint))
  (ok 
    (map-set revenue id {token0: u0, token1: u0})
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; ctors?? creators???
;; Private function to create a new symbol for a pair
(define-private (make-symbol (token0 <ft-trait>) (token1 <ft-trait>))
  (let 
    (
      ;; Get symbols for both tokens
      (sym0 (try! (contract-call? token0 get-symbol)))
      (sym1 (try! (contract-call? token1 get-symbol)))
    )
    ;; Checks that they are not the same symbol
    (asserts! (not (is-eq sym0 sym1)) err-create-preconditions)
    (ok
      ;; Creates the new symbol "sym0-sym1"
      (concat sym0 (concat "-" sym1)) 
    )
  )
)

;; Private Function to create a new pool
(define-private (make-pool (token0 <ft-trait>) (token1 <ft-trait>) (lp-token <ft-plus-trait>) (swap-fee (tuple (num uint) (den uint))) (protocol-fee (tuple (num uint) (den uint))) (share-fee (tuple (num uint) (den uint))))
  (ok 
    {
      ;; Calls make-symbol to create the new symbol
      symbol: (try! (make-symbol token0 token1)),
      token0: (contract-of token0),
      token1: (contract-of token1),
      lp-token: (contract-of lp-token),
      reserve0: u0,
      reserve1: u0,
      swap-fee: swap-fee,
      protocol-fee: protocol-fee,
      share-fee: share-fee,
      block-height: block-height,
      burn-block-height: burn-block-height,
    }
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Create
;; Public function to create a pool/pair
(define-public (create (token0 <ft-trait>) (token1 <ft-trait>) (lp-token <ft-plus-trait>) (swap-fee (tuple (num uint) (den uint))) (protocol-fee (tuple (num uint) (den uint))) (share-fee (tuple (num uint) (den uint))))
  (let 
    (
      ;; Extracts the principal of token0
      (t0 (contract-of token0))
      ;; Extracts the principal of token1
      (t1 (contract-of token1))
      ;; Extracts the principal of lp-token
      (lp (contract-of lp-token))
      ;; Creates the new pool with private function make-pool and stores information in pool
      (pool (try! (make-pool token0 token1 lp-token swap-fee protocol-fee share-fee)))
      ;; Gets this var to assign to the pool
      (id (next-pool-id)))

    ;; Pre-conditions
    ;; Checks if the tx-sender is the owner
    (try! (check-owner))
    ;; Asserts a list of things
    ;; (asserts!
    ;;   (and
        ;; t0 is not equal to t1 (not the same token) 
        (asserts! (not (is-eq t0 t1)) (err u1))
        ;; Checks that it doesn't exist already, wether it is t0-t1 or t1-t0
        (asserts! (is-none (lookup-pool t0 t1)) (err u2))
        ;; Sets value to false if no map, gets the value of the lp-tokens map for the lp-token and checks it is false
        (asserts! (not (default-to false (map-get? lp-tokens lp))) (err u3))
        ;; Checks that the numerator is smaller or equal to the denominator
        (asserts! (<= (get num swap-fee) (get den swap-fee)) (err u4))
        (asserts! (<= (get num protocol-fee) (get den protocol-fee)) (err u5))
        (asserts! (<= (get num share-fee) (get den share-fee)) (err u6))
        ;; Checks that swap-fee is not bigger than MAX-SWAP-FEE
        (asserts! (check-fee swap-fee MAX-SWAP-FEE) (err u7))
    ;;   )
    ;;   err-create-preconditions
    ;; )

    ;; Update global state
    ;; Update local state
    ;; Creates the new map for the pool
    (map-set pools id pool)
    ;; Creates the new index map to track the tokens
    (map-set index {token0: t0, token1: t1} id)
    ;; Updates the lp-token map to true, assuming then you can only once an LP Token 
    (map-set lp-tokens lp true)
    ;; Starts the map to track the revenue for a pool
    (map-set revenue id { token0: u0, token1: u0 })

    ;; Post-conditions
    ;; Return
    ;; Creates information to be printed if successful
    (let 
      (
        (event
          {
            op: "create",
            user: tx-sender,
            id: id,
            pool: pool
          }
        )
      )
      ;; This is not necessary
      (print event)
      ;; Returns the event information if successful
      (ok event)
    ) 
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Mint
(define-public (mint (id uint) (token0 <ft-trait>) (token1 <ft-trait>) (lp-token <ft-plus-trait>) (amt0 uint) (amt1 uint))
  (let 
    (
      ;; Get the pool information
      (pool (do-get-pool id))
      ;; Store the tx-sender in a new variable
      (user tx-sender)
      ;; Store the contract in a new variable
      (protocol (as-contract tx-sender))
      ;; Get the total supply for the lp-token
      (total-supply (try! (contract-call? lp-token get-total-supply)))
      ;; Get the reserve0 value from the pool
      (r0 (get reserve0 pool))
      ;; Get the reserve1 value from the pool
      (r1 (get reserve1 pool))
      ;; Call the calc-mint read only to get the liquidity
      (liquidity (calc-mint amt0 amt1 r0 r1 total-supply)) 
    )

    ;; Pre-conditions
    (asserts!
      (and 
        ;; Checks if the lp-token from the pool is equal to the lp-token in the params
        (is-eq (get lp-token pool) (contract-of lp-token))
        ;; Checks if the token0 from the pool is equal to the token0 in the params
        (is-eq (get token0 pool) (contract-of token0))
        ;; Checks if the token1 from the pool is equal to the token1 in the params
        (is-eq (get token1 pool) (contract-of token1))
        ;; Checks that amt, amt1 and liquidity are bigger than 0 
        (> amt0 u0)
        (> amt1 u0)
        (> liquidity u0) 
      )
      err-mint-preconditions
    )

    ;; Update global state
    ;; Sends the token0 to the protocol
    (try! (contract-call? token0 transfer amt0 user protocol none))
    ;; Sends the token1 to the protocol
    (try! (contract-call? token1 transfer amt1 user protocol none))
    ;; Mints the liquidity amount of the LP-token to the user
    (try! (as-contract (contract-call? lp-token mint liquidity user)))

    ;; Update local state
    ;; Calls the private function to update the reserves
    (unwrap-panic (update-reserves id (+ r0 amt0) (+ r1 amt1)))

    ;; Post-conditions
    (asserts! 
      (and
        ;; Guard against overflow in burn.
        ;; Ensure that the product of (total-supply + liquidity) and (r0 + amt0) is greater than zero
        (> (* (+ total-supply liquidity) (+ r0 amt0)) u0)
        ;; Ensure that the product of (total-supply + liquidity) and (r1 + amt1) is greater than zero
        (> (* (+ total-supply liquidity) (+ r1 amt1)) u0)
      )
      err-mint-postconditions
    )

    ;; Return
    (let 
      (
        (event
          {
            op: "mint",
            user: user,
            id: id,
            pool: pool,
            amt0: amt0,
            amt1: amt1,
            liquidity: liquidity,
            total-supply: total-supply
          }
        )
      )
      (print event)
      (ok event)
    ) 
  )
)

;; Function to calculate the amount to be minted to a user
;; calculates the liquidity to be minted based on the existing reserves and the amounts of tokens being added
(define-read-only (calc-mint (amt0 uint) (amt1 uint) (reserve0 uint) (reserve1 uint) (total-supply uint))
  (if (is-eq total-supply u0)
    ;; If total-supply = 0, calculates the square root of the product of amt0 and amt1
    (sqrti (* amt0 amt1))
    ;; If total-supply not eq to 0, calculates the minimum value between two divisions
    (min 
        (/ (* amt0 total-supply) reserve0)
        (/ (* amt1 total-supply) reserve1)
    )
  ) 
)

;; Function to calculate if "a" is smaller or equal to "b", if true return "a" if false return "b"
(define-read-only (min (a uint) (b uint)) 
  (if (<= a b) 
    a 
    b
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Burn
(define-public (burn (id uint) (token0 <ft-trait>) (token1 <ft-trait>) (lp-token <ft-plus-trait>) (liquidity uint))
  (let 
    (
      ;; Get the pool information
      (pool (do-get-pool id))
      ;; Store the tx-sender in a new variable
      (user tx-sender)
      ;; Store the contract in a new variable
      (protocol (as-contract tx-sender))
      ;; Get the total supply for the lp-token
      (total-supply (try! (contract-call? lp-token get-total-supply)))
      ;; Get the reserve0 value from the pool
      (r0 (get reserve0 pool))
      ;; Get the reserve1 value from the pool
      (r1 (get reserve1 pool))
      ;; Calls read only to calculate the amounts send to the user
      (amts (calc-burn liquidity r0 r1 total-supply))
      ;; Extracts amt0 from amts
      (amt0 (get amt0 amts))
      ;; Extracts amt1 from amts
      (amt1 (get amt1 amts))
    )

    ;; Pre-conditions
    ;; (asserts!
    ;;   (and 
        ;; Checks that lp-token from pool is same as lp-token from params
        (asserts! (is-eq (get lp-token pool) (contract-of lp-token)) (err u1001))
        ;; Checks that token0 from pool is same as token0 from params
        (asserts! (is-eq (get token0 pool) (contract-of token0)) (err u1002))
        ;; Checks that token1 from pool is same as token1 from params
        (asserts! (is-eq (get token1 pool) (contract-of token1)) (err u1003))
        ;; Checks if liquidity, amt0, amt1 are bigger than 0
        (asserts! (> liquidity u0) (err u1004))
        (asserts! (> amt0 u0) (err u1005))
        (asserts! (> amt1 u0) (err u1006)) 
    ;;   )
    ;;   err-burn-preconditions
    ;; )

    ;; Update global state
    ;; Sends from the contract to the user the token0
    (try! (as-contract (contract-call? token0 transfer amt0 protocol user none)))
    ;; Sends from the contract to the user the token1
    (try! (as-contract (contract-call? token1 transfer amt1 protocol user none)))
    ;; burns the lp-tokens
    (try! (as-contract (contract-call? lp-token burn liquidity user)))

    ;; Update local state
    ;; Updates the reserves of the pool
    (unwrap-panic (update-reserves id (- r0 amt0) (- r1 amt1)))

    ;; Post-conditions

    ;; Return
    (let 
      (
        (event
          {
            op: "burn",
            user: user,
            id: id,
            pool: pool,
            liquidity: liquidity,
            amt0: amt0,
            amt1: amt1,
            total-supply: total-supply
          }
        )
      )
      (print event)
      (ok event)
    ) 
  )
)

;; read only to calculate the amounts to be sent back to the user 
(define-read-only (calc-burn (liquidity uint) (reserve0 uint) (reserve1 uint) (total-supply uint))
  {
    ;; Divides the product of liquidity and reserve0 by the total-supply
    amt0: (/ (* liquidity reserve0) total-supply),
    ;; Divides the product of liquidity and reserve1 by the total-supply
    amt1: (/ (* liquidity reserve1) total-supply),
  }
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Swap
(define-public (swap (id uint) (token-in <ft-trait>) (token-out <ft-trait>) (rev-share0 <send-revenue-trait>) (amt-in uint) (amt-out uint))
  (let 
    (
      ;; Get the pool information
      (pool (do-get-pool id))
      ;; Set a variable to be the tx-sender 
      (user tx-sender)
      ;; Set the variable to be the core contract
      (protocol (as-contract tx-sender))
      ;; Extract token0 from pool information
      (t0 (get token0 pool))
      ;; Extract token1 from pool information
      (t1 (get token1 pool))
      ;; Checks if token-in is equal to token-0, returns true or false
      (is-token0 (is-eq (contract-of token-in) t0))
      ;; Extracts the swap-fee from the pool information
      (swap-fee (get swap-fee pool))
      ;; Extracts the protocol-fee from the pool information
      (protocol-fee (get protocol-fee pool))
      ;; Extracts the share-fee from the pool information
      (share-fee (get share-fee pool))
      ;; Calls the read only to calculate the amounts for the swap
      (amts (calc-swap amt-in swap-fee protocol-fee share-fee))
      ;; Extracts the amt-in-adjusted from the new tuple amts
      (amt-in-adjusted (get amt-in-adjusted amts))
      ;; Extracts the amt-fee-lps from the new tuple amts
      (amt-fee-lps (get amt-fee-lps amts))
      ;; Extracts the amt-fee-protocol from the new tuple amts
      (amt-fee-protocol (get amt-fee-protocol amts))
      ;; Extracts the amt-fee-share from the new tuple amts
      (amt-fee-share (get amt-fee-share amts))
      ;; Extracts the amt-fee-rest from the new tuple amts
      (amt-fee-rest (get amt-fee-rest amts))
      ;; Extracts the reserve0 from the pool information
      (r0 (get reserve0 pool))
      ;; Extracts the reserve2 from the pool information
      (r1 (get reserve1 pool))
      ;; Calculates k by multiplying r0 times r1 k is not used anywhere
      (k (* r0 r1))
      ;; Checks if is-token0 is true or false
      (bals 
        (if is-token0
          ;; If true returns a tuple with this information
          {
            bal0: (+ r0 amt-in-adjusted amt-fee-lps),
            bal1: (- r1 amt-out),
            a: (+ r0 amt-in-adjusted),
            b: (- r1 amt-out)
          }
          ;; If false returns a tuple with this information
          {
            bal0: (- r0 amt-out),
            bal1: (+ r1 amt-in-adjusted amt-fee-lps),
            a: (- r0 amt-out),
            b: (+ r1 amt-in-adjusted)
          }
        )
      )
        ;; Extracts information from the new tuple bals
        (b0 (get bal0 bals))
        (b1 (get bal1 bals))
        (a  (get a bals))
        (b  (get b bals)) 
    )

    ;; ;; Pre-conditions
    ;; (asserts!
      ;; Checks that both or statements are true, to see if it is a valid pair
      (and 
        ;; Checks if token-in is equal to t0 or t1
        (asserts! (or 
          (is-eq (contract-of token-in) t0)
          (is-eq (contract-of token-in) t1)
        ) (err u96))
        ;; Checks if token-out is equal to t0 or t1
        (asserts! (or 
          (is-eq (contract-of token-out) t0)
          (is-eq (contract-of token-out) t1)
        ) (err u97))
        ;; Checks that they are not the same token
        (asserts! (not (is-eq (contract-of token-in) (contract-of token-out))) (err u98))
        ;; Checks that the rev-share0 address is the same as calling the get-rev-share read only
        (asserts! (is-eq (contract-of rev-share0) (get-rev-share)) (err u99))
        ;; Checks that amt-in amt-out amt-in-adjusted are greater than 0
        (asserts! (> amt-in u0) (err u101))
        (asserts! (> amt-out u0) (err u102))
        (asserts! (> amt-in-adjusted u0) (err u103))
        ;; Checks if one of this is true
        (asserts! (or 
          ;; Checks that the numerator is-eq to the denumerator in the swap-fee
          (is-eq (get num swap-fee) (get den swap-fee))
          ;; Can get rid of the and... checks if amt-fee-lps is bigger than u0
          (and (> amt-fee-lps u0))
          ;; Checks if 1 of this is true
          (or 
            ;; the numerator of protocol-fee is the same as the denumerator of protocol fee
            (is-eq (get num protocol-fee) (get den protocol-fee))
            ;; the amt-fee-protocol is bigger than 0
            (> amt-fee-protocol u0)
          )
        ) (err u104))
        ;; checks if amt-in is the same as the addition of...
        (asserts! (is-eq amt-in (+ amt-in-adjusted amt-fee-lps amt-fee-share amt-fee-rest)) (err u105))
        ;; Checks that all of this values are bigger than 0
        (asserts! (> b0 u0) (err u106))
        (asserts! (> b1 u0) (err u107))
        (asserts! (> a  u0) (err u108))
        (asserts! (> b  u0) (err u109)) 
      )
    ;;   err-swap-preconditions
    ;; )

    ;; Update global state
    ;; Transfers the amt-in of token-in from the user to the protocol
    (try! (contract-call? token-in transfer amt-in user protocol none))
    ;; Transfers the amt-out of token-out from the protocol to the user
    (try! (as-contract (contract-call? token-out transfer amt-out protocol user none)))
    ;; Checks if amt-fee-share is bigger than 0
    (if (> amt-fee-share u0)
      ;; if true
      (begin
        ;; transfer the amt-fee of token-in from the protocol to the rev-share address
        (try! (as-contract (contract-call? token-in transfer amt-fee-share protocol (get-rev-share) none)))
        ;; call the send-revenue from the rev-share0 trait 
        (try! (as-contract (contract-call? rev-share0 send-revenue id is-token0 amt-fee-share)))
      )
      ;; if false return true
      true
    )

    ;; Update local state
    ;; Update reserves with the private function to new values
    (unwrap-panic (update-reserves id b0 b1))
    ;; Update the revenues with the private function to new values
    (unwrap-panic (update-revenue id is-token0 amt-fee-rest))

    ;; Post-conditions
    ;; Checks if the product of a and b is bigger or equal than k
    (asserts! (>= (* a b) k) err-swap-postconditions)

    ;; Return
    (let 
      (
        (event
          {
            op: "swap",
            user: user,
            id: id,
            pool: pool,
            token-in: token-in,
            token-out: token-out,
            amt-in: amt-in,
            amt-out: amt-out,
            amt-in-adjusted: amt-in-adjusted,
            amt-fee-lps: amt-fee-lps,
            amt-fee-protocol: amt-fee-protocol,
            amt-fee-share: amt-fee-share,
            amt-fee-rest: amt-fee-rest,
            b0: b0,
            b1: b1,
            a: a,
            b: b,
            k: k
          }
        )
      )
      ;; (print event)
      (ok event)
    )
  )
)

;;swap-fee e.g. 998/1000
;;share-fee e.g. 50/1000
;;protocol fee e.g. 250/1000
(define-read-only (calc-swap (amt-in uint) (swap-fee (tuple (num uint) (den uint))) (protocol-fee (tuple (num uint) (den uint))) (share-fee (tuple (num uint) (den uint))))
  (let 
    (
      ;; Calculate the adjusted amount to be swapped in based on the swap-fee
      (amt-in-adjusted (/ (* amt-in (get num swap-fee)) (get den swap-fee)))
      ;; Calculate the total fee amount
      (amt-fee-total (- amt-in amt-in-adjusted))
      ;; Calculate the fee amount for the protocol
      (amt-fee-protocol (/ (* amt-fee-total (get num protocol-fee)) (get den protocol-fee)))
      ;; Calculate the fee-lps
      (amt-fee-lps (- amt-fee-total amt-fee-protocol))
      ;; Calculate the share-fee
      (amt-fee-share (/ (* amt-fee-protocol (get num share-fee)) (get den share-fee)))
      ;; Calculate the fee-rest (remaining amount)
      (amt-fee-rest (- amt-fee-protocol amt-fee-share))
    )
    ;; Return a tuple with all information
    ;; {
    ;;   amt-in-adjusted: amt-in-adjusted,
    ;;   amt-fee-lps: amt-fee-lps,
    ;;   amt-fee-protocol: amt-fee-protocol,
    ;;   amt-fee-share: amt-fee-share,
    ;;   amt-fee-rest: amt-fee-rest
    ;; } 
        {
      amt-in-adjusted: amt-in-adjusted,
      amt-fee-total: amt-fee-total,
      amt-fee-protocol: amt-fee-protocol,
      amt-fee-lps: amt-fee-lps,
      amt-fee-share: amt-fee-share,
      amt-fee-rest: amt-fee-rest,
    } 
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Collect
(define-public (collect (id uint) (token0 <ft-trait>) (token1 <ft-trait>))
  (let 
    (
      ;; Get the pool information
      (pool (do-get-pool id))
      ;; Store the tx-sender
      (user tx-sender)
      ;; Store the contract 
      (protocol (as-contract tx-sender))
      ;; calls do-get-revenue to get the revenue map
      (rev (do-get-revenue id))
      ;; Gets the amounts for token0 and token1 from the rev map
      (amt0 (get token0 rev))
      (amt1 (get token1 rev))
    )

    ;; Pre-conditions
    ;; Calls the check-fee-to to check that tx-sender is the same as fee-to address
    (try! (check-fee-to))
    ;; Checks that both this conditions are true
    (asserts!
      (and 
        ;; token0 is equal to token0 from the pool
        (is-eq (contract-of token0) (get token0 pool))
        ;; token1 is equal to token1 from the pool
        (is-eq (contract-of token1) (get token1 pool)) 
      )
      err-collect-preconditions
    )

    ;; Update global state
    ;; If amt0 is greater than or equal to 0??? No need to do this
    (if (>= amt0 u0)
      ;; If true transfer token0 from the contract to the user
      (try! (as-contract (contract-call? token0 transfer amt0 protocol user none)))
      ;; if false
      false
    )
    ;; If amt0 is greater than or equal to 0??? No need to do this
    (if (>= amt1 u0)
      ;; If true transfer token1 from the contract to the user
      (try! (as-contract (contract-call? token1 transfer amt1 protocol user none)))
      ;; if false
      false
    )

    ;; Update local state
    ;; reset revenue to 0
    (unwrap-panic (reset-revenue id))

    ;; Post-conditions

    ;; Return
    (let 
      (
        (event
          {
            op: "collect",
            user: user,
            id: id,
            pool: pool,
            revenue: rev 
          }
        )
      )
      (print event)
      (ok event) 
    )
  )
)

;;; End of file