;; usda-token

;;;;;;;;;;;;;;;;;;;;; SIP 010 ;;;;;;;;;;;;;;;;;;;;;;
(impl-trait .sip-010-trait-ft-standard.sip-010-trait)


;; Defines the USDA Stablecoin according to the SIP-010 Standard
(define-fungible-token DAI)

(define-data-var token-uri (string-utf8 256) u"")

(define-constant authorized-minter 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)


;; errors
(define-constant err-unauthorized-transfer (err u1))


;; ---------------------------------------------------------
;; SIP-10 Functions
;; ---------------------------------------------------------

(define-read-only (get-total-supply)
  (ok (ft-get-supply DAI))
)

(define-read-only (get-name)
  (ok "DAI")
)

(define-read-only (get-symbol)
  (ok "DAI")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance DAI account))
)

(define-read-only (get-balance-simple (account principal))
  (ft-get-balance DAI account)
)


(define-read-only (get-token-uri)
  (ok (some (var-get token-uri)))
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-unauthorized-transfer)

    (match (ft-transfer? DAI amount sender recipient)
      response (begin
        (print memo)
        (ok response)
      )
      error (err error)
    )
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (ft-mint? DAI amount recipient)
  )
)

(define-public (burn (amount uint))
  (begin
    (ft-burn? DAI amount tx-sender)
  )
)

