using System;
using System.Collections.Generic;
using UnityEngine;

namespace RealityHunt.Core
{
    public enum GameState
    {
        Boot,
        Menu,
        Tutorial,
        Briefing,
        Exploration,
        ClueDiscovery,
        Puzzle,
        Encounter,
        Result,
        Pause,
        Failure
    }

    public class GameStateMachine : MonoBehaviour
    {
        public static GameStateMachine Instance { get; private set; }

        [SerializeField] private GameState currentState = GameState.Boot;
        public GameState CurrentState => currentState;

        public event Action<GameState, GameState> OnStateChanged;

        private readonly Dictionary<GameState, List<GameState>> validTransitions = new()
        {
            { GameState.Boot, new List<GameState> { GameState.Menu } },
            { GameState.Menu, new List<GameState> { GameState.Tutorial, GameState.Briefing } },
            { GameState.Tutorial, new List<GameState> { GameState.Exploration, GameState.Menu } },
            { GameState.Briefing, new List<GameState> { GameState.Exploration, GameState.Menu } },
            { GameState.Exploration, new List<GameState> { GameState.ClueDiscovery, GameState.Puzzle, GameState.Encounter, GameState.Result, GameState.Pause, GameState.Failure, GameState.Menu } },
            { GameState.ClueDiscovery, new List<GameState> { GameState.Exploration, GameState.Puzzle, GameState.Encounter } },
            { GameState.Puzzle, new List<GameState> { GameState.Exploration, GameState.Encounter, GameState.Result, GameState.Failure } },
            { GameState.Encounter, new List<GameState> { GameState.Exploration, GameState.Puzzle, GameState.Result, GameState.Failure } },
            { GameState.Result, new List<GameState> { GameState.Menu, GameState.Exploration } },
            { GameState.Pause, new List<GameState> { GameState.Exploration, GameState.Menu } },
            { GameState.Failure, new List<GameState> { GameState.Menu, GameState.Exploration } }
        };

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public bool CanTransitionTo(GameState nextState)
        {
            return validTransitions.TryGetValue(currentState, out var allowed) && allowed.Contains(nextState);
        }

        public bool TransitionTo(GameState nextState)
        {
            if (currentState == nextState) return true;

            if (!CanTransitionTo(nextState))
            {
                Debug.LogWarning($"[GameStateMachine] Invalid transition rejected: {currentState} -> {nextState}");
                return false;
            }

            var from = currentState;
            currentState = nextState;
            Debug.Log($"[GameStateMachine] State: {from} -> {nextState}");
            OnStateChanged?.Invoke(from, nextState);
            return true;
        }
    }
}
