import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
    
    // 🔥 TRINETRA MASTER RULE APPLIED: 
    // Firebase aur Crashlytics yahan se 100% hamesha ke liye HATA diya gaya hai.
    // Ab sab kuchh AWS CloudWatch aur Sentry (jo tumhari key me hai) se track hoga.
}

// Load signing properties
val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("app/key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "com.trinetra.app"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    signingConfigs {
        if (keystorePropertiesFile.exists()) {
            create("release") {
                keyAlias = keystoreProperties.getProperty("keyAlias") as String
                keyPassword = keystoreProperties.getProperty("keyPassword") as String
                storeFile = file(keystoreProperties.getProperty("storeFile") as String)
                storePassword = keystoreProperties.getProperty("storePassword") as String
            }
        }
    }

    defaultConfig {
        applicationId = "com.trinetra.app"
        
        // 🔥 TRINETRA MASTER UPGRADE: AWS aur ZegoCloud (WhatsApp 2.0) ke liye minSdk 24 compulsory hai
        minSdk = 24 
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        
        // Point 6: Itne saare Gateways aur AI integrations ke liye MultiDex zaroori hai
        multiDexEnabled = true
    }

    buildTypes {
        release {
            signingConfig = if (keystorePropertiesFile.exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
            
            // 🔥 ASLI PRODUCTION READY: Code chori na ho aur app fast rahe isliye Minify TRUE kiya gaya hai
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

flutter {
    source = "../.."
}

dependencies {
    // 🔥 MULTIDEX ENGINE: Upar multiDexEnabled=true ko chalane ke liye asli engine (Joda gaya)
    implementation("androidx.multidex:multidex:2.0.1")
}
