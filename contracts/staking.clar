;; VELAR staking.
;;
;; Historical distributions are absorbed via at-block in this version.
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Constants
;; General Errors
(define-constant err-stake-preconditions (err u701))
(define-constant err-stake-postconditions (err u702))
(define-constant err-unstake-preconditions (err u703))
(define-constant err-unstake-postconditions (err u704))

;; in VELAR; bounds the number of stakers
;; Min stake amount of tokens
;; Maybe make it a variable
(define-constant MIN-STAKE u500)
;; in blocks; not currently used
(define-constant MIN-TIME u1) 

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; State
;; total amount staked per user
(define-map user-staked principal uint)
;; total amount staked across all users         
(define-data-var total-staked uint u0)
;; last block any state changes were made
(define-data-var last-block uint block-height)   

;; Read only to get total staked by a principal
(define-read-only (get-user-staked (user principal))
  (default-to u0 (map-get? user-staked user)) 
)

;; Read only to get total staked in general
(define-read-only (get-total-staked) (var-get total-staked))

;; Reand only to get the last block any state changes were made
(define-read-only (get-last-block) (var-get last-block))

;; Private function to set the information for vars and maps about staking
(define-private (do-stake (user principal) (amt uint))
  (begin
    (var-set total-staked (+ (get-total-staked) amt))
    (map-set user-staked user (+ (get-user-staked user) amt))
    (ok (var-set last-block block-height))
  )
)

;; TODO: delete map entry if zero?
;; Private function to update information when someone unstakes
(define-private (do-unstake (user principal) (amt uint))
  (begin
    (var-set total-staked (- (get-total-staked) amt))
    (map-set user-staked user (- (unwrap-panic (map-get? user-staked user)) amt))
    (ok (var-set last-block block-height))
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; get-share-at
;; Call the get-share-at read only function, we can skip this part
(define-read-only (get-share (user principal))
  (get-share-at user block-height)
)

;; read only to get 
(define-read-only (get-share-at (user principal) (block uint))
  (let 
    (
      ;; get the current block-height and store it
      (current block-height)
      ;; Get the last block a change was made
      (last (get-last-block))
      ;; Check if block is greater than last, if true return last if false return block
      (height (if (> block last) last block))
      ;; Get the hash of the block at that height
      (header (unwrap-panic (get-block-info? id-header-hash height))))
      ;; (header  (unwrap-panic (get-burn-block-info? burnchain-header-hash height))))

    ;; Check if block and current are equal
    (if 
      (is-eq block current)
        ;; if true return the information of staked and total staked on the last block a change was made on the contract
        {
          staked: (get-user-staked user),
          total: (get-total-staked)
        }
        ;; if false return the information of that specific block
        {
          staked: (at-block header (get-user-staked user)),
          total: (at-block header (get-total-staked))
        }
    ) 
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Stake
(define-public (stake (amt uint))
  (let 
    (
      ;; Store the tx-sender
      (user tx-sender)
      ;; Store the contract address
      (protocol (as-contract tx-sender))
      ;; Get the total staked by a user
      (staked (get-user-staked user)))

    ;; Preconditions
    ;; Check if staked plus amt is bigger or equal than 500
    (asserts! (>= (+ staked amt) MIN-STAKE) err-stake-preconditions)

    ;; Update global state
    ;; transfers the velar from the user to the protocol
    (try! (contract-call? .velar transfer amt user protocol none))

    ;; Update local state
    ;; updates the amount that was sent as stake in the maps and variables
    (unwrap-panic (do-stake user amt))

    ;; Postconditions
    ;; No need for the and... check if the balance of velar token from the contract is bigger or equal than the total staked
    ;; This is impossible to fail, unless someone has control to make transfer from the protocol
    (asserts! 
      (and 
        (>= (unwrap-panic (contract-call? .velar get-balance protocol)) (get-total-staked))
      ) 
      err-stake-postconditions
    )

    ;; Return
    (let 
      (
        (event
          {
            op: "stake",
            user: user,
            amt: amt,
            user-staked: (+ staked amt),
            total-staked: (get-total-staked),
          }
        )
      )
      (print event)
      (ok event) 
    ) 
  ) 
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Unstake
;; Ustake function
(define-public (unstake (amt uint))
  (let 
    (
      ;; Store the tx-sender 
      (user tx-sender)
      ;; Store the contract
      (protocol (as-contract tx-sender))
      ;; Get total staked by a user
      (staked (get-user-staked user))
    )

    ;; Preconditions
    ;; Checks that both this conditions are met
    (asserts!
      ;; amt is smaller than or equal to staked
      (and
        (<= amt staked)
        ;; also checks if one if this two is true
        (or 
          ;; the substraction of staked - amt is greater than or equal to 500
          (>= (- staked amt) MIN-STAKE)
          ;; checks if staked is equal to amt
          (is-eq staked amt)
        )
      ) 
      err-unstake-preconditions
    )

    ;; Update global state
    ;; Send the velar from the contract to the user
    (try! (as-contract (contract-call? .velar transfer amt protocol user none)))

    ;; Update local state
    ;; update all maps and variables
    (unwrap-panic (do-unstake user amt))

    ;; Postconditions
    ;; Can get rid of the and....
    ;; Again impossible to happen
    (asserts!
      (and
        ;; Checks that the velar balance from the contract is greater than or equal to the total staked
        (>= (unwrap-panic (contract-call? .velar get-balance protocol)) (var-get total-staked))
      ) 
      err-unstake-postconditions
    )

    ;; Return
    (let 
      (
        (event
          {
            op: "unstake",
            user: user,
            amt: amt,
            user-staked: (- staked amt),
            total-staked: (get-total-staked),
          }
        )
      )
      (print event)
      (ok event) 
    ) 
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Safety
;; (define-public (force-unstake-all (user principal))
;;   (check-owner)
;;   )

;;; End of file