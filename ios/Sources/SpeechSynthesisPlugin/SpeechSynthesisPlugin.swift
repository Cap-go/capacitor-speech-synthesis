import Foundation
import Capacitor
import AVFoundation

/**
 * Speech Synthesis Plugin for iOS using AVSpeechSynthesizer
 */
@objc(SpeechSynthesisPlugin)
public class SpeechSynthesisPlugin: CAPPlugin, CAPBridgedPlugin, AVSpeechSynthesizerDelegate {
    private let pluginVersion: String = "8.0.6"
    public let identifier = "SpeechSynthesisPlugin"
    public let jsName = "SpeechSynthesis"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "speak", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "synthesizeToFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancel", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pause", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resume", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isSpeaking", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getVoices", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getLanguages", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isLanguageAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isVoiceAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "activateAudioSession", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "deactivateAudioSession", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise)
    ]

    private var synthesizer: AVSpeechSynthesizer?
    private var utteranceIdCounter: Int = 0
    private var utteranceMap: [String: AVSpeechUtterance] = [:]

    override public func load() {
        super.load()
        synthesizer = AVSpeechSynthesizer()
        synthesizer?.delegate = self
    }

    @objc func speak(_ call: CAPPluginCall) {
        guard let text = call.getString("text") else {
            call.reject("Text is required")
            return
        }

        let utteranceId = "ios-utterance-\(utteranceIdCounter)"
        utteranceIdCounter += 1

        let utterance = AVSpeechUtterance(string: text)

        // Set voice
        if let voiceId = call.getString("voiceId") {
            if let voice = AVSpeechSynthesisVoice(identifier: voiceId) {
                utterance.voice = voice
            }
        } else if let language = call.getString("language") {
            if let voice = AVSpeechSynthesisVoice(language: language) {
                utterance.voice = voice
            }
        }

        // Set speech parameters
        if let pitch = call.getFloat("pitch") {
            utterance.pitchMultiplier = max(0.5, min(2.0, pitch))
        }
        if let rate = call.getFloat("rate") {
            utterance.rate = max(AVSpeechUtteranceMinimumSpeechRate, min(AVSpeechUtteranceMaximumSpeechRate, rate * AVSpeechUtteranceDefaultSpeechRate))
        }
        if let volume = call.getFloat("volume") {
            utterance.volume = max(0.0, min(1.0, volume))
        }

        // Handle queue strategy
        let queueStrategy = call.getString("queueStrategy") ?? "Add"
        if queueStrategy == "Flush" {
            synthesizer?.stopSpeaking(at: .immediate)
            utteranceMap.removeAll()
        }

        utteranceMap[utteranceId] = utterance

        // Store utteranceId in userData for delegate callbacks
        let userInfo: [String: Any] = ["utteranceId": utteranceId]
        setValue(userInfo, forKey: "currentUtteranceId")

        synthesizer?.speak(utterance)

        call.resolve([
            "utteranceId": utteranceId
        ])
    }

    @objc func synthesizeToFile(_ call: CAPPluginCall) {
        guard let text = call.getString("text") else {
            call.reject("Text is required")
            return
        }

        let utteranceId = "ios-file-\(utteranceIdCounter)"
        utteranceIdCounter += 1

        let utterance = AVSpeechUtterance(string: text)

        // Set voice
        if let voiceId = call.getString("voiceId") {
            if let voice = AVSpeechSynthesisVoice(identifier: voiceId) {
                utterance.voice = voice
            }
        } else if let language = call.getString("language") {
            if let voice = AVSpeechSynthesisVoice(language: language) {
                utterance.voice = voice
            }
        }

        // Set speech parameters
        if let pitch = call.getFloat("pitch") {
            utterance.pitchMultiplier = max(0.5, min(2.0, pitch))
        }
        if let rate = call.getFloat("rate") {
            utterance.rate = max(AVSpeechUtteranceMinimumSpeechRate, min(AVSpeechUtteranceMaximumSpeechRate, rate * AVSpeechUtteranceDefaultSpeechRate))
        }

        // Write to file
        let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let audioFilename = documentsPath.appendingPathComponent("\(utteranceId).caf")

        synthesizer?.write(utterance) { (buffer: AVAudioBuffer) in
            guard let pcmBuffer = buffer as? AVAudioPCMBuffer else {
                call.reject("Failed to get PCM buffer")
                return
            }

            if let audioFile = try? AVAudioFile(forWriting: audioFilename, settings: pcmBuffer.format.settings) {
                do {
                    try audioFile.write(from: pcmBuffer)
                    call.resolve([
                        "filePath": audioFilename.path,
                        "utteranceId": utteranceId
                    ])
                } catch {
                    call.reject("Failed to write audio file: \(error.localizedDescription)")
                }
            } else {
                call.reject("Failed to create audio file")
            }
        }
    }

    @objc func cancel(_ call: CAPPluginCall) {
        synthesizer?.stopSpeaking(at: .immediate)
        utteranceMap.removeAll()
        call.resolve()
    }

    @objc func pause(_ call: CAPPluginCall) {
        synthesizer?.pauseSpeaking(at: .immediate)
        call.resolve()
    }

    @objc func resume(_ call: CAPPluginCall) {
        synthesizer?.continueSpeaking()
        call.resolve()
    }

    @objc func isSpeaking(_ call: CAPPluginCall) {
        let isSpeaking = synthesizer?.isSpeaking ?? false
        call.resolve([
            "isSpeaking": isSpeaking
        ])
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve([
            "isAvailable": true
        ])
    }

    @objc func getVoices(_ call: CAPPluginCall) {
        let voices = AVSpeechSynthesisVoice.speechVoices()
        let voiceInfos = voices.map { voice -> [String: Any] in
            var info: [String: Any] = [
                "id": voice.identifier,
                "name": voice.name,
                "language": voice.language
            ]

            // Add gender
            switch voice.gender {
            case .male:
                info["gender"] = "male"
            case .female:
                info["gender"] = "female"
            default:
                info["gender"] = "neutral"
            }

            // Add network requirement
            // Higher quality voices (enhanced/premium) typically don't require network
            // Default quality = 1, Enhanced quality = 2
            info["isNetworkConnectionRequired"] = voice.quality.rawValue < 2

            return info
        }

        call.resolve([
            "voices": voiceInfos
        ])
    }

    @objc func getLanguages(_ call: CAPPluginCall) {
        let voices = AVSpeechSynthesisVoice.speechVoices()
        let languages = Array(Set(voices.map { $0.language })).sorted()

        call.resolve([
            "languages": languages
        ])
    }

    @objc func isLanguageAvailable(_ call: CAPPluginCall) {
        guard let language = call.getString("language") else {
            call.reject("Language is required")
            return
        }

        let voices = AVSpeechSynthesisVoice.speechVoices()
        let isAvailable = voices.contains { $0.language == language }

        call.resolve([
            "isAvailable": isAvailable
        ])
    }

    @objc func isVoiceAvailable(_ call: CAPPluginCall) {
        guard let voiceId = call.getString("voiceId") else {
            call.reject("Voice ID is required")
            return
        }

        let isAvailable = AVSpeechSynthesisVoice(identifier: voiceId) != nil

        call.resolve([
            "isAvailable": isAvailable
        ])
    }

    @objc func initialize(_ call: CAPPluginCall) {
        // Pre-warm the speech synthesizer
        if synthesizer == nil {
            synthesizer = AVSpeechSynthesizer()
            synthesizer?.delegate = self
        }
        call.resolve()
    }

    @objc func activateAudioSession(_ call: CAPPluginCall) {
        let category = call.getString("category") ?? "Playback"

        let audioSession = AVAudioSession.sharedInstance()
        do {
            if category == "Ambient" {
                try audioSession.setCategory(.ambient, mode: .default)
            } else {
                try audioSession.setCategory(.playback, mode: .default)
            }
            try audioSession.setActive(true)
            call.resolve()
        } catch {
            call.reject("Failed to activate audio session: \(error.localizedDescription)")
        }
    }

    @objc func deactivateAudioSession(_ call: CAPPluginCall) {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setActive(false, options: .notifyOthersOnDeactivation)
            call.resolve()
        } catch {
            call.reject("Failed to deactivate audio session: \(error.localizedDescription)")
        }
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": self.pluginVersion])
    }

    // MARK: - AVSpeechSynthesizerDelegate

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        if let utteranceId = getUtteranceId(for: utterance) {
            notifyListeners("start", data: [
                "utteranceId": utteranceId
            ])
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        if let utteranceId = getUtteranceId(for: utterance) {
            utteranceMap.removeValue(forKey: utteranceId)
            notifyListeners("end", data: [
                "utteranceId": utteranceId
            ])
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, willSpeakRangeOfSpeechString characterRange: NSRange, utterance: AVSpeechUtterance) {
        if let utteranceId = getUtteranceId(for: utterance) {
            notifyListeners("boundary", data: [
                "utteranceId": utteranceId,
                "charIndex": characterRange.location,
                "charLength": characterRange.length
            ])
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        if let utteranceId = getUtteranceId(for: utterance) {
            utteranceMap.removeValue(forKey: utteranceId)
            notifyListeners("error", data: [
                "utteranceId": utteranceId,
                "error": "Speech was cancelled"
            ])
        }
    }

    // Helper method to get utteranceId
    private func getUtteranceId(for utterance: AVSpeechUtterance) -> String? {
        return utteranceMap.first(where: { $0.value == utterance })?.key
    }
}
