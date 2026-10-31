using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace RealityHunt.AR
{
    [RequireComponent(typeof(ARSession))]
    [RequireComponent(typeof(ARSessionOrigin))]
    [RequireComponent(typeof(ARRaycastManager))]
    [RequireComponent(typeof(ARPlaneManager))]
    public class ARFoundationProvider : MonoBehaviour
    {
        [Header("AR Foundation Components")]
        [SerializeField] private ARSession arSession;
        [SerializeField] private ARSessionOrigin arOrigin;
        [SerializeField] private ARRaycastManager raycastManager;
        [SerializeField] private ARPlaneManager planeManager;

        [Header("Fallback Settings")]
        [SerializeField] private bool useSimulatedRoomWhenUnavailable = true;
        [SerializeField] private GameObject simulatedRoomPrefab;

        private GameObject activeSimulatedRoom;
        private readonly List<ARRaycastHit> hits = new();

        public bool IsARAvailable => ARSession.state >= ARSessionState.Ready;

        private void Awake()
        {
            if (arSession == null) arSession = GetComponent<ARSession>();
            if (arOrigin == null) arOrigin = GetComponent<ARSessionOrigin>();
            if (raycastManager == null) raycastManager = GetComponent<ARRaycastManager>();
            if (planeManager == null) planeManager = GetComponent<ARPlaneManager>();
        }

        private void Start()
        {
            CheckAndInitializeSession();
        }

        public void CheckAndInitializeSession()
        {
            if (ARSession.state == ARSessionState.Unsupported && useSimulatedRoomWhenUnavailable)
            {
                EnableSimulatedRoomFallback();
            }
        }

        public void EnableSimulatedRoomFallback()
        {
            Debug.Log("[ARFoundationProvider] Enabling 3D Simulated Room Fallback");
            if (arSession != null) arSession.enabled = false;
            if (planeManager != null) planeManager.enabled = false;

            if (simulatedRoomPrefab != null && activeSimulatedRoom == null)
            {
                activeSimulatedRoom = Instantiate(simulatedRoomPrefab, Vector3.zero, Quaternion.identity);
            }
        }

        public bool RaycastWorld(Vector2 screenPoint, out Pose hitPose)
        {
            hitPose = Pose.identity;

            if (raycastManager != null && raycastManager.Raycast(screenPoint, hits, TrackableType.PlaneWithinPolygon))
            {
                hitPose = hits[0].pose;
                return true;
            }

            // Fallback raycast in simulated environment
            Ray ray = Camera.main.ScreenPointToRay(screenPoint);
            if (Physics.Raycast(ray, out RaycastHit hitInfo, 20f))
            {
                hitPose = new Pose(hitInfo.point, Quaternion.LookRotation(hitInfo.normal));
                return true;
            }

            return false;
        }
    }
}
