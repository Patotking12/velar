(define-public (swap (amt-in uint) (amt-out uint))
  (let 
    (
      ;; Checks if token-in is equal to token-0, returns true or false
      (is-token0 true)
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

    ;; Pre-conditions
    ;; (asserts!
    (and 
        ;; Checks that amt-in amt-out amt-in-adjusted are greater than 0
        (asserts! (> amt-in u0) (err u101))
        (asserts! (> amt-out u0) (err u102))
        (asserts! (> amt-in-adjusted u0) (err u103))
        ;; Checks if one of this is true
        (or 
          ;; Checks that the numerator is-eq to the denumerator in the swap-fee
          (asserts! (is-eq (get num swap-fee) (get den swap-fee))(err u104))
          ;; Can get rid of the and... checks if amt-fee-lps is bigger than u0
          (asserts! (and (> amt-fee-lps u0)) (err u105))
          ;; Checks if 1 of this is true
          (or 
            ;; the numerator of protocol-fee is the same as the denumerator of protocol fee
            (asserts! (is-eq (get num protocol-fee) (get den protocol-fee)) (err u106))
            ;; the amt-fee-protocol is bigger than 0
            (asserts! (> amt-fee-protocol u0) (err u107))
          )
        )
        ;; checks if amt-in is the same as the addition of...
        (asserts! (is-eq amt-in (+ amt-in-adjusted amt-fee-lps amt-fee-share amt-fee-rest)) (err u108))
        ;; Checks that all of this values are bigger than 0
        (asserts! (> b0 u0) (err u109))
        (asserts! (> b1 u0) (err u110))
        (asserts! (> a  u0) (err u111))
        (asserts! (> b  u0) (err u112)) 
      )
    ;;   err-swap-preconditions
    ;; )

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
    ;;   (print event)
      (ok event)
    )
  )
)

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
    {
      amt-in-adjusted: amt-in-adjusted,
      amt-fee-lps: amt-fee-lps,
      amt-fee-protocol: amt-fee-protocol,
      amt-fee-share: amt-fee-share,
      amt-fee-rest: amt-fee-rest
    } 
  )
)