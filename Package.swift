// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorSpeechSynthesis",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapgoCapacitorSpeechSynthesis",
            targets: ["SpeechSynthesisPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "SpeechSynthesisPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/SpeechSynthesisPlugin"),
        .testTarget(
            name: "SpeechSynthesisPluginTests",
            dependencies: ["SpeechSynthesisPlugin"],
            path: "ios/Tests/SpeechSynthesisPluginTests")
    ]
)
