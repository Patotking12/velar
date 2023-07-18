;;; Staking core: maintains a historical distribution of stake shares.

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; errors
(define-constant err-stake-preconditions (err u901))
(define-constant err-stake-postconditions (err u902))
(define-constant err-unstake-preconditions (err u903))
(define-constant err-unstake-postconditions (err u904))
(define-constant err-share-preconditions (err u905))
(define-constant err-share-postconditions (err u906))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; constants
;; Minimum stake amount.
(define-constant MIN-STAKE u500)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Map blocks to epochs
;; Represents the length of an epoch, defined as 200.
(define-constant EPOCH-LENGTH u200) ;; (* u7 u24 u7)) ;;~1 week at ~10min/block
;; Represents the block height of the genesis block
(define-constant GENESIS-BLOCK block-height)
;; Represents the epoch of the genesis block. It is calculated by calling the calc-epoch function with the GENESIS-BLOCK as the argument. Represents the EPOCH 0
(define-constant GENESIS-EPOCH (calc-epoch GENESIS-BLOCK)) ;;zero

(define-read-only (current-epoch) (calc-epoch block-height))

(define-read-only (calc-epoch (block uint))
  (/ (- block GENESIS-BLOCK) EPOCH-LENGTH)
)

(define-read-only (calc-epoch-start (epoch uint))
  (+ GENESIS-BLOCK (* EPOCH-LENGTH epoch))
)

(define-read-only (calc-epoch-end (epoch uint))
  (- (+ GENESIS-BLOCK (* EPOCH-LENGTH (+ epoch u1))) u1)
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; state
;; Total staked amount through all users
(define-data-var total-staked
    {
        epoch: uint, ;;last state change
        min  : uint, ;;minimum staked during current epoch
        end  : uint ;;total staked during current epoch
    } 
    {
        epoch: GENESIS-EPOCH,
        min  : u0,
        end  : u0
    }
)

;; Total staked amount of a user in an Epoch
(define-map user-staked principal
    {
        epoch: uint,
        min  : uint,
        end  : uint
    }
)

;; Get the total staked in the contract 
(define-read-only (get-total-staked) (var-get total-staked))

;; Get the total staked by a user, it defaults to 0
(define-read-only (get-user-staked (user principal))
    (default-to
        {
            epoch: GENESIS-EPOCH, 
            min: u0, 
            end: u0
        }
    (map-get? user-staked user)
    )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; stake
;; Staking function
(define-public (stake (amt uint))
    (let 
        (
            (user tx-sender)
            (protocol (as-contract tx-sender))
            ;; Gets the current epoch using the block-height of the current transaction
            (epoch (current-epoch))
            ;; Retrieves the value of the total-staked variable using the get-total-staked function
            (t-staked (get-total-staked))
            ;; Retrieves the staked amount for the user using the get-user-staked function
            (u-staked (get-user-staked user))
            ;; Calculates the updated total staked amount by adding amt to the existing total staked amount
            (t-end1 (+ (get end t-staked) amt))
            ;; Calculates the updated staked amount for the user user by adding amt to the existing staked amount
            (u-end1 (+ (get end u-staked) amt)) 
        )

        ;; Preconditions
        (asserts!
            (and
                ;; I think we don't need to assert this, it will always be true
                (>= epoch GENESIS-EPOCH)
                ;; Checks if Current Epoch is greater than or equal than the epoch retreived from total-staked
                ;; Will always be true... don't need to assert this
                (>= epoch (get epoch t-staked))
                ;; Checks if Current Epoch is greater than or equal than the epoch retreived from user-staked
                ;; Will always be true... don't need to assert this
                (>= epoch (get epoch u-staked))
                ;; Check if the epoch from total-staked is greater than or equal to the epoch from user-staked
                (>= (get epoch t-staked) (get epoch u-staked))
                ;; Checks that amount to stake is greater than 0
                (> amt u0)
                ;; Checks that the updated amount of the total user-staked is greater than the MIN-STAKE
                (>= u-end1 MIN-STAKE)
            )
            err-stake-preconditions
        )

        ;; Update global state
        ;; Transfers the Velar from the user to the protocol
        (try! (contract-call? .velar transfer amt user protocol none))

        ;; Update local state
        ;; N.B. during the genesis epoch, min is always zero.
        ;; Checks if current epoch is equal to the epoch of total-staked
        (if (is-eq epoch (get epoch t-staked))
            ;; If true it updates the total-staked-amount of the total-staked var to the t-end1 amount
            (var-set total-staked
                (merge t-staked {end: t-end1})
            )
            ;; If false set a new var to a new epoch and set the min to the last total-staked from previous epoch adn the current total staked to t-end1
            (var-set total-staked
                {
                    epoch: epoch,
                    min: (get end t-staked),
                    end: t-end1
                }
            )
        )
        
        ;; do the same but for the user map
        (if (is-eq epoch (get epoch u-staked))
            (map-set user-staked user 
                (merge u-staked {end: u-end1})
            )
            (map-set user-staked user
                {
                    epoch: epoch,
                    min: (get end u-staked),
                    end: u-end1
                }
            )
        )

        ;; Postconditions
        ;; This will always be true
        (asserts! (>= (unwrap-panic (contract-call? .velar get-balance protocol)) (get end (get-total-staked))) err-stake-postconditions)

        ;; Return
        (let 
            (
                (event
                    {
                        op: "stake",
                        user: user,
                        amt: amt,
                        epoch: epoch,
                        total-old: t-staked,
                        user-old: u-staked,
                        total-new: (get-total-staked),
                        user-new: (get-user-staked user)
                    }
                )
            )
            (print event)
            (ok event)
        )
    )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; unstake
(define-public (unstake (amt uint))
    (let 
        (
            (user tx-sender)
            (protocol (as-contract tx-sender))
            ;; Gets the current epoch using the block-height of the current transaction
            (epoch (current-epoch))
            ;; Retrieves the value of the total-staked variable using the get-total-staked function
            (t-staked (get-total-staked))
            ;; Retrieves the staked amount for the user using the get-user-staked function
            (u-staked (get-user-staked user))
            ;; Calculates the updated total staked amount by adding amt to the existing total staked amount
            ;; This should be a minus
            (t-end1 (- (get end t-staked) amt))
            ;; Calculates the updated staked amount for the user user by adding amt to the existing staked amount
            (u-end1 (- (get end u-staked) amt)) 
            ;; Calculates the new minimum staked amount for the total staked variable by taking the minimum of t-end1 and the existing minimum staked amount.
            (t-min1 (min t-end1 (get min t-staked))) ;;unstake most recent first
            ;; Calculates the new minimum staked amount for the user user by taking the minimum of u-end1 and the existing minimum staked amount.
            (u-min1 (min u-end1 (get min u-staked))) 
        )

        ;; Preconditions
        ;; (asserts!
        ;;     (and
                ;; I think we don't need to assert this, it will always be true
                (asserts! (>= epoch GENESIS-EPOCH) (err u1))
                ;; Checks if Current Epoch is greater than or equal than the epoch retreived from total-staked
                ;; Will always be true... don't need to assert this
                (asserts! (>= epoch (get epoch t-staked)) (err u2))
                ;; Checks if Current Epoch is greater than or equal than the epoch retreived from user-staked
                ;; Will always be true... don't need to assert this
                (asserts! (>= epoch (get epoch u-staked)) (err u3))
                ;; Check if the epoch from total-staked is greater than or equal to the epoch from user-staked
                (asserts! (>= (get epoch t-staked) (get epoch u-staked)) (err u4))
                ;; Checks that amount to stake is greater than 0
                (asserts! (> amt u0) (err u5))
                ;; Checks if the amount is less than or equal to the total staked by the user
                (asserts! (<= amt (get end u-staked)) (err u6))
                ;; Checks that the min stake is still staked OR that the balance is 0
                (asserts! (or (>= u-end1 MIN-STAKE)
                    (is-eq u-end1 u0)
                ) (err u7))
            ;; )
        ;;     err-unstake-preconditions
        ;; )

        ;; Update global state
        ;; Transfers the belar from the contract to the user
        (try! (as-contract (contract-call? .velar transfer amt protocol user none)))

        ;; Update local state
        ;; N.B. during the genesis epoch, min is always zero.
        ;; checks if current epoch 
        (if (is-eq epoch (get epoch t-staked))
            ;; If true update the min and end from the total-staked var
            (var-set total-staked (merge t-staked {min: t-min1, end: t-end1}))
            ;; If false update the whole var a new epoch
            (var-set total-staked
                {
                    epoch: epoch,
                    min  : t-end1,
                    end  : t-end1
                }
            )
        )

        ;; Does the same for the user
        (if (is-eq epoch (get epoch u-staked))
            (map-set user-staked user (merge u-staked {min: u-min1, end: u-end1}))
            (map-set user-staked user
                {
                    epoch: epoch,
                    min  : u-end1,
                    end  : u-end1
                }
            )
        )

        ;; Postconditions
        (asserts! (>= (unwrap-panic (contract-call? .velar get-balance protocol)) (get end (get-total-staked))) err-unstake-postconditions)

        ;; Return
        (let 
            (
                (event
                    {
                        op: "unstake",
                        user: user,
                        amt: amt,
                        epoch: epoch,
                        total-old: t-staked,
                        user-old: u-staked,
                        total-new: (get-total-staked),
                        user-new: (get-user-staked user)
                    }
                )
            )
            (print event)
            (ok event) 
        )
    )
)

(define-read-only (min (x uint) (y uint)) (if (<= x y) x y))

(define-read-only (get-balance-protocol)
    (contract-call? .velar get-balance .staking-core)
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; staking distribution over time
(define-read-only (get-share-at (user principal) (epoch uint))
    (let 
        (
            (last-block (calc-epoch-end epoch))
            (header (unwrap-panic (get-block-info? id-header-hash last-block)))
            (t-at (at-block header (get-total-staked)))
            (u-at (at-block header (get-user-staked user)))
            (t-amt (eligible-amount epoch t-at))
            (u-amt (eligible-amount epoch u-at))
            (share {staked: u-amt, total: t-amt}) 
        )

        ;; Preconditions
        (asserts!
            (and
                (< epoch (current-epoch))
                (<= (get epoch t-at) epoch)
                (<= (get epoch u-at) epoch)
            )
            err-share-preconditions
        )
        (ok share) 
    )
)

(define-read-only (eligible-amount (goal uint) (entry {epoch: uint, min: uint, end: uint}))
    (if (is-eq goal (get epoch entry))
      ;; If the specific epoch we are looking at had interactions,
      ;; only the minimum amount staked continuously during that
      ;; period counts.
      (get min entry)
      ;; Otherwise carry over staked amount from previous epoch.
      (get end entry)
    ) 
)

;;; eof
