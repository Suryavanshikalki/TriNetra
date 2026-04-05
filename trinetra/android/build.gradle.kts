buildscript {
    extra["kotlin_version"] = "2.1.0"
    repositories {
        google()
        mavenCentral()
        // 🔥 TRINETRA ASLI POWER: ZegoCloud (WhatsApp 2.0) aur PayU/Braintree ke liye JitPack compulsory hai
        maven { url = uri("https://jitpack.io") }
    }
    dependencies {
        // =========================================================
        // 🚨 FIREBASE KHATM (Master Rule Applied) 🚨
        // classpath("com.google.gms:google-services:4.4.2") 
        // classpath("com.google.firebase:firebase-crashlytics-gradle:3.0.3") 
        // =========================================================

        // 🔥 ASLI TRACKING ENGINE: Crashlytics ki jagah ab Sentry chalega (Jo tumhari 17 Keys me hai)
        classpath("io.sentry:sentry-android-gradle-plugin:4.3.0")

        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.0")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        // 🔥 TRINETRA MASTER ENGINE: Sabhi subprojects aur 6-in-1 AI ke liye JitPack yahan bhi joda gaya
        maven { url = uri("https://jitpack.io") }
    }
    configurations.all {
        resolutionStrategy {
            force("org.jetbrains.kotlin:kotlin-stdlib:2.1.0")
            force("org.jetbrains.kotlin:kotlin-stdlib-jdk7:2.1.0")
            force("org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.1.0")
        }
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
