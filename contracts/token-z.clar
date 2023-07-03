(impl-trait .sip-010-trait-ft-standard.sip-010-trait)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u403))
(define-constant err-not-token-owner (err u101))

;; No maximum supply!
(define-fungible-token token-z)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
	(begin
		(asserts! (is-eq tx-sender sender) err-not-token-owner)
		(try! (ft-transfer? token-z amount sender recipient))
		(match memo to-print (print to-print) 0x)
		(ok true)
	)
)

(define-read-only (get-name)
	(ok "Z")
)

(define-read-only (get-symbol)
	(ok "Z")
)

(define-read-only (get-decimals)
	(ok u8)
)

(define-read-only (get-balance (who principal))
	(ok (ft-get-balance token-z who))
)

(define-read-only (get-total-supply)
	(ok (ft-get-supply token-z))
)

(define-read-only (get-token-uri)
	(ok none)
)

(define-public (mint (amount uint) (recipient principal))
	(begin
		(asserts! (or (is-eq contract-caller contract-owner) (is-eq tx-sender contract-owner)) err-owner-only)
		(ft-mint? token-z amount recipient)
	)
)
