;;; Reward distribution.

;; (use-trait ft-trait 'ST20X3DC5R091J8B6YPQT638J8NR1W83KN6JQ4P6F.sip-010-trait-ft-standard.sip-010-trait)
(use-trait ft-trait .sip-010-trait-ft-standard.sip-010-trait)
(impl-trait .token-mngr-trait.send-revenue-trait)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; constants
(define-constant err-check-owner               (err u801))
(define-constant err-check-core                (err u802))
(define-constant err-distribute-preconditions  (err u803))
(define-constant err-distribute-postconditions (err u804))

(define-constant GENESIS-BLOCK block-height)
(define-read-only (get-genesis-block) GENESIS-BLOCK)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; auth
(define-data-var owner principal tx-sender)
(define-read-only (get-owner) (var-get owner))
(define-private (check-owner)
  (ok (asserts! (is-eq tx-sender (get-owner)) err-check-owner)))
(define-public (set-owner (new-owner principal))
  (begin
   (try! (check-owner))
   (ok (var-set owner new-owner)) ))

(define-data-var core principal .core)
(define-read-only (get-core) (var-get core))
(define-private (check-core)
  (ok (asserts! (is-eq tx-sender (get-core)) err-check-core)))
(define-public (set-core (new-core principal))
  (begin
   (try! (check-owner))
   (ok (var-set core new-core)) ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; accounting
(define-map revenue
  {pool: uint, block: uint}
  {token0: uint, token1: uint}) ;;total revenue shared for that pool (per block)

(define-read-only (get-revenue-at (pool uint) (block uint))
  (default-to
    {token0: u0, token1: u0}
    (map-get? revenue {pool: pool, block: block}) ))

;; Called by core.clar on swap.
;; MUST ALWAYS BE ACCOMPANIED BY A CORRECT TRANSFER!
(define-public
  (send-revenue
    (pool      uint)
    (is-token0 bool)
    (amt       uint))

  (let ((block block-height)
        (key   {pool: pool, block: block})
        (r0    (get-revenue-at pool block))
        (t0r   (get token0 r0))
        (t1r   (get token1 r0))
        (r1    {token0: (if is-token0 (+ t0r amt) t0r),
                token1: (if is-token0 t1r (+ t1r amt)) }))

    (try! (check-core)) ;;XXX: crucial to enforce invariant!
    (ok (map-set revenue key r1)) ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; claims
(define-map claims
  {user: principal, pool: uint, block: uint}
  uint) ;; block number claimed at

(define-private
  (do-claim
   (user  principal)
   (pool  uint)
   (block uint))
  (map-set claims
           {user: user, pool: pool, block: block}
           block-height))

(define-read-only
  (has-claimed-block
   (user principal)
   (pool uint)
   (block uint))

  (not (is-eq
   (default-to
     u0
     (map-get? claims {user: user, pool: pool, block: block}) )
   u0)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; low level API
(define-private
  (do-distribute
   (user   principal)
   (token0 <ft-trait>)
   (token1 <ft-trait>)
   (amts   {token0: uint, token1: uint}))

  (let ((protocol (as-contract tx-sender))
        (amt0     (get token0 amts))
        (amt1     (get token1 amts))
        (tx0      (if (> amt0 u0)
                    (try! (as-contract (contract-call? token0 transfer
                                                       amt0 protocol user none)))
                    true) )
        (tx1      (if (> amt1 u0)
                    (try! (as-contract (contract-call? token1 transfer
                                                       amt1 protocol user none)))
                    true)))
    (if (and tx0 tx1) (ok true) err-distribute-postconditions) ))

(define-read-only
  (calc-distribute
   (share {staked: uint, total: uint})
   (rev   {token0: uint, token1: uint}))
  {
  token0: (if (> (get total share) u0)
              (/ (* (get token0 rev) (get staked share)) (get total share))
            u0),
  token1: (if (> (get total share) u0)
              (/ (* (get token1 rev) (get staked share)) (get total share))
            u0)
  })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; distribute-block
(define-public
  (distribute-block
   (user   principal)
   (id     uint)
   (token0 <ft-trait>)
   (token1 <ft-trait>)
   (block  uint))

  (let ((pool  (contract-call? .core do-get-pool id))
        (share (contract-call? .staking get-share-at user block))
        (rev   (get-revenue-at id block))
        (amts  (calc-distribute share rev)) )

    ;; Preconditions
    (asserts!
     (and
      (not (has-claimed-block user id block))
      (< block block-height)
      (is-eq (contract-of token0) (get token0 pool))
      (is-eq (contract-of token1) (get token1 pool))
      )
     err-distribute-preconditions)

    ;; Update global state
    (try! (do-distribute user token0 token1 amts))

    ;; Update local state
    (do-claim user id block)

    ;; Postconditions

    ;; Return
    (let ((event
           {op     : "distribute-block",
            user   : user,
            pool   : pool,
            block  : block,
            share  : share,
            revenue: rev,
            amts   : amts
           }))
      (print event)
      (ok event)) ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; distribute-blocks
(define-private
  (distribute-blocks-step
   (block uint)
   (args  {user: principal, pool: uint, token0: <ft-trait>, token1: <ft-trait>}))

  (let ((event_
         (unwrap-panic
          (distribute-block
           (get user args)
           (get pool args)
           (get token0 args)
           (get token1 args)
           block)) ))
    args))

(define-public
  (distribute-blocks
   (user   principal)
   (pool   uint)
   (token0 <ft-trait>)
   (token1 <ft-trait>)
   (blocks (list 600 uint))) ;;XXX: EPOCH-LEN

  (let ((args {user  : user,
               pool  : pool,
               token0: token0,
               token1: token1})
        (res_ (fold distribute-blocks-step blocks args)))

    ;; Return
    (let ((event
           {op    : "distribute-blocks",
            user  : user,
            pool  : pool,
            blocks: (len blocks)
           }))
      (print event)
      (ok event) )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; compute reward block list

;; Returns all blocks in the epoch starting at `start-block' for which
;; `user' has non-zero rewards.
;; Pagination via GENESIS-BLOCK and `end-block'.
(define-read-only
  (has-reward (args {block : uint,
                    reward: {token0: uint, token1: uint}}))
  (or (> (get token0 (get reward args)) u0)
      (> (get token1 (get reward args)) u0)) )

(define-read-only
  (get-reward
   (user  principal)
   (pool  uint)
   (block uint))

  (let ((share   (contract-call? .staking get-share-at user block))
        (rev     (get-revenue-at pool block))
        (claimed (has-claimed-block user pool block))
        (amts    (calc-distribute share rev)))

    (if claimed {token0: u0, token1: u0} amts) ))

(define-read-only
  (get-rewards-step
   (block uint)
   (state {args: {user: principal, pool: uint},
           acc : (list 600 ;;XXX: EPOCH-LEN
                       {block : uint,
                        reward: {token0: uint, token1: uint}}) }) )

  (let ((reward (get-reward (get user (get args state))
                            (get pool (get args state))
                            block)))
    {args: (get args state),
     acc : (unwrap-panic
            (as-max-len?
             (append (get acc state)
                     {block : block,
                      reward: reward})
             u600 )) }) ) ;;XXX: EPOCH-LEN

(define-read-only
  (get-rewards
   (user        principal)
   (pool        uint)
   (start-block uint))

  (let ((end-block      (+ start-block EPOCH-LEN)) ;;FIXME test off by ones
        (epoch          (mkepoch start-block))
        (args           {user: user, pool: pool})
        (reward-blocks0 (fold get-rewards-step epoch {args: args, acc: (list)}))
        (reward-blocks  (filter has-reward (get acc reward-blocks0))))

    {reward-blocks: reward-blocks,
     end-block    : end-block} ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; epochs
(define-constant EPOCH
  (list
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0 u0
   ))

(define-constant EPOCH-LEN (len EPOCH)) ;; 600

(define-private
  (mkepoch-step
   (i_     uint)
   (state {block: uint, acc: (list 600 uint)})) ;; XXX: EPOCH-LEN
  {block: (+ (get block state) u1),
   acc  : (unwrap-panic
           (as-max-len?
            (append (get acc state) (get block state))
            u600))}) ;; XXX: EPOCH-LEN

(define-read-only (mkepoch (start-block uint))
  (let ((state (fold mkepoch-step EPOCH {block: start-block, acc: (list)})))
    (get acc state)))

;;; eof