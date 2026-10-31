using UnityEngine;

namespace RealityHunt.Entity
{
    public enum EntityState
    {
        Dormant,
        Stalking,
        Manifesting,
        Hunting,
        Banished
    }

    public class VisitorEntityAI : MonoBehaviour
    {
        [Header("State & Metrics")]
        [SerializeField] private EntityState currentState = EntityState.Dormant;
        [Range(0f, 1f)] [SerializeField] private float fearLevel = 0.05f;
        [SerializeField] private float targetDistance = 8.5f;

        [Header("Tension Parameters")]
        [SerializeField] private float difficultyFactor = 1.0f;
        [SerializeField] private Transform playerCamera;
        [SerializeField] private Light auraLight;
        [SerializeField] private ParticleSystem glitchParticles;

        private float stateTimer = 0f;

        public EntityState State => currentState;
        public float FearLevel => fearLevel;
        public float TargetDistance => targetDistance;

        private void Update()
        {
            stateTimer += Time.deltaTime;
            UpdateBehavior(Time.deltaTime);
            UpdateVisuals();
        }

        private void UpdateBehavior(float delta)
        {
            switch (currentState)
            {
                case EntityState.Dormant:
                    targetDistance = 10.0f;
                    fearLevel = 0.05f;
                    break;

                case EntityState.Stalking:
                    targetDistance = Mathf.Max(4.5f, targetDistance - delta * 0.15f);
                    fearLevel = Mathf.Clamp01(0.15f + (10f - targetDistance) * 0.05f);
                    break;

                case EntityState.Manifesting:
                    targetDistance = 3.5f + Mathf.Sin(stateTimer * 2f) * 0.3f;
                    fearLevel = Mathf.Clamp01(0.5f + (4f - targetDistance) * 0.2f);
                    if (stateTimer > 25.0f / difficultyFactor)
                    {
                        TransitionTo(EntityState.Hunting);
                    }
                    break;

                case EntityState.Hunting:
                    targetDistance = Mathf.Max(1.1f, targetDistance - delta * 0.4f * difficultyFactor);
                    fearLevel = Mathf.Clamp01(0.8f + (2f - targetDistance) * 0.2f);
                    break;

                case EntityState.Banished:
                    targetDistance = 25f;
                    fearLevel = 0f;
                    gameObject.SetActive(false);
                    break;
            }
        }

        private void UpdateVisuals()
        {
            if (playerCamera == null) return;

            // Place in front of player at target distance
            Vector3 targetPos = playerCamera.position + playerCamera.forward * targetDistance;
            targetPos.y = playerCamera.position.y - 0.2f;
            transform.position = targetPos;
            transform.LookAt(playerCamera);

            if (auraLight != null)
            {
                auraLight.intensity = currentState == EntityState.Hunting ? 2.5f : 0.8f;
            }
        }

        public void TransitionTo(EntityState nextState)
        {
            currentState = nextState;
            stateTimer = 0f;
        }

        public void Banish()
        {
            TransitionTo(EntityState.Banished);
        }
    }
}
