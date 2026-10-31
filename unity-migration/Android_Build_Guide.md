# REALITY HUNT — Android Native Build Guide (Unity & ARCore)

This guide documents the exact configuration required to compile REALITY HUNT into a native Android APK / AAB package targeting Google ARCore-supported Android devices.

---

## 1. Prerequisites
- **Unity Version**: Unity 2022.3.x LTS or 2023.2.x LTS with Android Build Support (OpenJDK, Android SDK & NDK tools).
- **Minimum Android Version**: Android 8.0 (API Level 26 - "Oreo")
- **Target API Level**: Android 14.0 (API Level 34)
- **Scripting Backend**: IL2CPP
- **Target Architectures**: ARM64 (mandatory for modern 64-bit Google Play requirements)

---

## 2. Package Manager Dependencies (`Packages/manifest.json`)
Ensure the following packages are present:
```json
{
  "dependencies": {
    "com.unity.xr.arfoundation": "5.1.0",
    "com.unity.xr.arcore": "5.1.0",
    "com.unity.xr.arkit": "5.1.0",
    "com.unity.postprocessing": "3.3.0",
    "com.unity.ugui": "2.0.0"
  }
}
```

---

## 3. XR Plug-in Management Setup
1. In Unity, navigate to **Edit** > **Project Settings** > **XR Plug-in Management**.
2. Under the **Android tab**, check **ARCore**.
3. Under **ARCore Settings**:
   - Set **ARCore Required** to `Optional` (so devices without ARCore can still run the 3D Simulated Room fallback).
   - Set **Depth Mode** to `Automatic` or `Disabled`.

---

## 4. Android Player Settings
In **Project Settings** > **Player** > **Other Settings**:
- **Package Name**: `com.realityhunt.game`
- **Minimum API Level**: Android 8.0 (API level 26)
- **Target API Level**: Android 14 (API level 34)
- **Scripting Backend**: `IL2CPP`
- **Target Architectures**: Check `ARM64` (uncheck ARMv7)
- **Camera Usage Description**: `"Reality Hunt requires camera access to place fictional supernatural entities and investigative clues into your surroundings."`

---

## 5. Permissions in `AndroidManifest.xml`
Ensure the manifest includes camera permissions with safety flags:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Camera is optional so devices without camera permission can use simulated mode -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera.ar" android:required="false" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-permission android:name="android.permission.VIBRATE" />
</manifest>
```

---

## 6. Building the Project
1. Open **File** > **Build Settings**.
2. Select **Android** and click **Switch Platform**.
3. Add scenes in order:
   - `0: Scenes/Boot.unity`
   - `1: Scenes/MainMenu.unity`
   - `2: Scenes/Episode1_TheVisitor.unity`
4. Click **Build** to produce `RealityHunt.apk`.
