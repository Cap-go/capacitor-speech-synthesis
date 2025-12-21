package ee.forgr.plugin.speechsynthesis;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.json.JSONException;

@CapacitorPlugin(name = "SpeechSynthesis")
public class SpeechSynthesisPlugin extends Plugin {

    private final String pluginVersion = "8.0.6";
    private TextToSpeech tts;
    private int utteranceIdCounter = 0;
    private boolean ttsInitialized = false;

    @Override
    public void load() {
        super.load();
        initializeTTS();
    }

    private void initializeTTS() {
        tts = new TextToSpeech(getContext(), (status) -> {
            if (status == TextToSpeech.SUCCESS) {
                ttsInitialized = true;
                setupUtteranceProgressListener();
            }
        });
    }

    private void setupUtteranceProgressListener() {
        tts.setOnUtteranceProgressListener(
            new UtteranceProgressListener() {
                @Override
                public void onStart(String utteranceId) {
                    JSObject data = new JSObject();
                    data.put("utteranceId", utteranceId);
                    notifyListeners("start", data);
                }

                @Override
                public void onDone(String utteranceId) {
                    JSObject data = new JSObject();
                    data.put("utteranceId", utteranceId);
                    notifyListeners("end", data);
                }

                @Override
                @Deprecated
                public void onError(String utteranceId) {
                    JSObject data = new JSObject();
                    data.put("utteranceId", utteranceId);
                    data.put("error", "Speech synthesis error");
                    notifyListeners("error", data);
                }

                @Override
                public void onError(String utteranceId, int errorCode) {
                    JSObject data = new JSObject();
                    data.put("utteranceId", utteranceId);
                    data.put("error", getErrorMessage(errorCode));
                    notifyListeners("error", data);
                }

                @Override
                public void onRangeStart(String utteranceId, int start, int end, int frame) {
                    JSObject data = new JSObject();
                    data.put("utteranceId", utteranceId);
                    data.put("charIndex", start);
                    data.put("charLength", end - start);
                    notifyListeners("boundary", data);
                }
            }
        );
    }

    private String getErrorMessage(int errorCode) {
        switch (errorCode) {
            case TextToSpeech.ERROR_SYNTHESIS:
                return "Synthesis error";
            case TextToSpeech.ERROR_SERVICE:
                return "Service error";
            case TextToSpeech.ERROR_OUTPUT:
                return "Output error";
            case TextToSpeech.ERROR_NETWORK:
                return "Network error";
            case TextToSpeech.ERROR_NETWORK_TIMEOUT:
                return "Network timeout";
            case TextToSpeech.ERROR_INVALID_REQUEST:
                return "Invalid request";
            case TextToSpeech.ERROR_NOT_INSTALLED_YET:
                return "TTS not installed yet";
            default:
                return "Unknown error";
        }
    }

    @PluginMethod
    public void speak(PluginCall call) {
        if (!ttsInitialized) {
            call.reject("Text-to-Speech engine not initialized");
            return;
        }

        String text = call.getString("text");
        if (text == null || text.isEmpty()) {
            call.reject("Text is required");
            return;
        }

        String utteranceId = "android-utterance-" + (utteranceIdCounter++);

        // Set language or voice
        String language = call.getString("language");
        String voiceId = call.getString("voiceId");

        if (voiceId != null) {
            Voice voice = findVoiceById(voiceId);
            if (voice != null) {
                tts.setVoice(voice);
            }
        } else if (language != null) {
            Locale locale = Locale.forLanguageTag(language);
            tts.setLanguage(locale);
        }

        // Set speech parameters
        Float pitch = call.getFloat("pitch", 1.0f);
        Float rate = call.getFloat("rate", 1.0f);

        tts.setPitch(pitch);
        tts.setSpeechRate(rate);

        // Handle queue strategy
        String queueStrategy = call.getString("queueStrategy", "Add");
        int queueMode = queueStrategy.equals("Flush") ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD;

        // Create parameters bundle
        Bundle params = new Bundle();
        Float volume = call.getFloat("volume");
        if (volume != null) {
            params.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, volume);
        }
        params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId);

        // Speak
        tts.speak(text, queueMode, params, utteranceId);

        JSObject result = new JSObject();
        result.put("utteranceId", utteranceId);
        call.resolve(result);
    }

    @PluginMethod
    public void synthesizeToFile(PluginCall call) {
        if (!ttsInitialized) {
            call.reject("Text-to-Speech engine not initialized");
            return;
        }

        String text = call.getString("text");
        if (text == null || text.isEmpty()) {
            call.reject("Text is required");
            return;
        }

        String utteranceId = "android-file-" + (utteranceIdCounter++);

        // Set language or voice
        String language = call.getString("language");
        String voiceId = call.getString("voiceId");

        if (voiceId != null) {
            Voice voice = findVoiceById(voiceId);
            if (voice != null) {
                tts.setVoice(voice);
            }
        } else if (language != null) {
            Locale locale = Locale.forLanguageTag(language);
            tts.setLanguage(locale);
        }

        // Set speech parameters
        Float pitch = call.getFloat("pitch", 1.0f);
        Float rate = call.getFloat("rate", 1.0f);

        tts.setPitch(pitch);
        tts.setSpeechRate(rate);

        // Create output file
        File outputFile = new File(getContext().getFilesDir(), utteranceId + ".wav");

        // Synthesize to file
        Bundle params = new Bundle();
        params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId);

        int result = tts.synthesizeToFile(text, params, outputFile, utteranceId);

        if (result == TextToSpeech.SUCCESS) {
            JSObject response = new JSObject();
            response.put("filePath", outputFile.getAbsolutePath());
            response.put("utteranceId", utteranceId);
            call.resolve(response);
        } else {
            call.reject("Failed to synthesize to file");
        }
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        if (tts != null) {
            tts.stop();
        }
        call.resolve();
    }

    @PluginMethod
    public void pause(PluginCall call) {
        // Android TTS doesn't support pause/resume natively
        // We'll stop instead as a fallback
        if (tts != null) {
            tts.stop();
        }
        call.resolve();
    }

    @PluginMethod
    public void resume(PluginCall call) {
        // Android TTS doesn't support pause/resume natively
        call.resolve();
    }

    @PluginMethod
    public void isSpeaking(PluginCall call) {
        boolean isSpeaking = tts != null && tts.isSpeaking();
        JSObject result = new JSObject();
        result.put("isSpeaking", isSpeaking);
        call.resolve(result);
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject result = new JSObject();
        result.put("isAvailable", ttsInitialized);
        call.resolve(result);
    }

    @PluginMethod
    public void getVoices(PluginCall call) {
        JSArray voicesArray = new JSArray();

        if (tts != null) {
            Set<Voice> voices = tts.getVoices();
            if (voices != null) {
                for (Voice voice : voices) {
                    JSObject voiceInfo = new JSObject();
                    voiceInfo.put("id", voice.getName());
                    voiceInfo.put("name", voice.getName());
                    voiceInfo.put("language", voice.getLocale().toLanguageTag());
                    voiceInfo.put("isNetworkConnectionRequired", voice.isNetworkConnectionRequired());

                    voicesArray.put(voiceInfo);
                }
            }
        }

        JSObject result = new JSObject();
        result.put("voices", voicesArray);
        call.resolve(result);
    }

    @PluginMethod
    public void getLanguages(PluginCall call) {
        Set<String> languageSet = new HashSet<>();

        if (tts != null) {
            Set<Voice> voices = tts.getVoices();
            if (voices != null) {
                for (Voice voice : voices) {
                    languageSet.add(voice.getLocale().toLanguageTag());
                }
            }
        }

        List<String> languages = new ArrayList<>(languageSet);
        JSArray languagesArray = new JSArray(languages);

        JSObject result = new JSObject();
        result.put("languages", languagesArray);
        call.resolve(result);
    }

    @PluginMethod
    public void isLanguageAvailable(PluginCall call) {
        String language = call.getString("language");
        if (language == null) {
            call.reject("Language is required");
            return;
        }

        Locale locale = Locale.forLanguageTag(language);
        boolean isAvailable = tts != null && tts.isLanguageAvailable(locale) >= TextToSpeech.LANG_AVAILABLE;

        JSObject result = new JSObject();
        result.put("isAvailable", isAvailable);
        call.resolve(result);
    }

    @PluginMethod
    public void isVoiceAvailable(PluginCall call) {
        String voiceId = call.getString("voiceId");
        if (voiceId == null) {
            call.reject("Voice ID is required");
            return;
        }

        boolean isAvailable = findVoiceById(voiceId) != null;

        JSObject result = new JSObject();
        result.put("isAvailable", isAvailable);
        call.resolve(result);
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        if (!ttsInitialized) {
            initializeTTS();
        }
        call.resolve();
    }

    @PluginMethod
    public void activateAudioSession(PluginCall call) {
        // Not applicable on Android
        call.resolve();
    }

    @PluginMethod
    public void deactivateAudioSession(PluginCall call) {
        // Not applicable on Android
        call.resolve();
    }

    @PluginMethod
    public void getPluginVersion(PluginCall call) {
        JSObject result = new JSObject();
        result.put("version", pluginVersion);
        call.resolve(result);
    }

    private Voice findVoiceById(String voiceId) {
        if (tts != null) {
            Set<Voice> voices = tts.getVoices();
            if (voices != null) {
                for (Voice voice : voices) {
                    if (voice.getName().equals(voiceId)) {
                        return voice;
                    }
                }
            }
        }
        return null;
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.handleOnDestroy();
    }
}
