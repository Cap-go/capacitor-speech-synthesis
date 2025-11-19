
import './style.css';
import { SpeechSynthesis } from '@capgo/capacitor-speech-synthesis';

const plugin = SpeechSynthesis;
const state = {};


const actions = [
{
              id: 'speak',
              label: 'Speak text',
              description: 'Synthesizes and speaks the provided text.',
              inputs: [{ name: 'text', label: 'Text to speak', type: 'textarea', value: 'Hello! This is a speech synthesis test.' }, { name: 'language', label: 'Language (optional)', type: 'text', value: 'en-US', placeholder: 'e.g., en-US, es-ES' }, { name: 'rate', label: 'Rate (0.1-10)', type: 'number', value: 1.0 }, { name: 'pitch', label: 'Pitch (0.5-2)', type: 'number', value: 1.0 }, { name: 'volume', label: 'Volume (0-1)', type: 'number', value: 1.0 }],
              run: async (values) => {
                const result = await plugin.speak({
  text: values.text,
  language: values.language || undefined,
  rate: Number(values.rate),
  pitch: Number(values.pitch),
  volume: Number(values.volume),
});
return result;
              },
            },
{
              id: 'get-voices',
              label: 'Get available voices',
              description: 'Retrieves all available TTS voices on the device.',
              inputs: [],
              run: async (values) => {
                const result = await plugin.getVoices();
return result;
              },
            },
{
              id: 'get-languages',
              label: 'Get supported languages',
              description: 'Retrieves all supported language codes.',
              inputs: [],
              run: async (values) => {
                const result = await plugin.getSupportedLanguages();
return result;
              },
            },
{
              id: 'pause',
              label: 'Pause speech',
              description: 'Pauses ongoing speech synthesis.',
              inputs: [],
              run: async (values) => {
                await plugin.pause();
return 'Speech paused.';
              },
            },
{
              id: 'resume',
              label: 'Resume speech',
              description: 'Resumes paused speech synthesis.',
              inputs: [],
              run: async (values) => {
                await plugin.resume();
return 'Speech resumed.';
              },
            },
{
              id: 'stop',
              label: 'Stop speech',
              description: 'Stops ongoing speech synthesis.',
              inputs: [],
              run: async (values) => {
                await plugin.stop();
return 'Speech stopped.';
              },
            },
{
              id: 'is-speaking',
              label: 'Check if speaking',
              description: 'Checks if speech synthesis is currently active.',
              inputs: [],
              run: async (values) => {
                const result = await plugin.isSpeaking();
return result;
              },
            },
{
              id: 'get-max-speech-length',
              label: 'Get max speech length',
              description: 'Gets the maximum text length supported (Android only).',
              inputs: [],
              run: async (values) => {
                const result = await plugin.getMaxSpeechInputLength();
return result;
              },
            },
{
              id: 'synthesize-to-file',
              label: 'Synthesize to file',
              description: 'Synthesizes text and saves it to an audio file.',
              inputs: [{ name: 'text', label: 'Text to synthesize', type: 'textarea', value: 'This will be saved to a file.' }, { name: 'filename', label: 'Filename', type: 'text', value: 'synthesis.wav' }, { name: 'language', label: 'Language (optional)', type: 'text', value: 'en-US' }],
              run: async (values) => {
                const result = await plugin.synthesizeToFile({
  text: values.text,
  filename: values.filename,
  language: values.language || undefined,
});
return result;
              },
            },
{
  id: 'set-audio-session',
  label: 'Set audio session category (iOS)',
  description: 'Sets the audio session category for playback behavior.',
  inputs: [{ name: 'category', label: 'Category', type: 'select', value: 'playback', options: [{ value: 'ambient', label: 'Ambient' }, { value: 'playback', label: 'Playback' }, { value: 'playAndRecord', label: 'Play and Record' }] }],
  run: async (values) => {
    await plugin.setAudioSessionCategory({ category: values.category });
return `Audio session set to: ${values.category}`;
  },
}
];

const actionSelect = document.getElementById('action-select');
const formContainer = document.getElementById('action-form');
const descriptionBox = document.getElementById('action-description');
const runButton = document.getElementById('run-action');
const output = document.getElementById('plugin-output');

function buildForm(action) {
  formContainer.innerHTML = '';
  if (!action.inputs || !action.inputs.length) {
    const note = document.createElement('p');
    note.className = 'no-input-note';
    note.textContent = 'This action does not require any inputs.';
    formContainer.appendChild(note);
    return;
  }
  action.inputs.forEach((input) => {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = input.type === 'checkbox' ? 'form-field inline' : 'form-field';

    const label = document.createElement('label');
    label.textContent = input.label;
    label.htmlFor = `field-${input.name}`;

    let field;
    switch (input.type) {
      case 'textarea': {
        field = document.createElement('textarea');
        field.rows = input.rows || 4;
        break;
      }
      case 'select': {
        field = document.createElement('select');
        (input.options || []).forEach((option) => {
          const opt = document.createElement('option');
          opt.value = option.value;
          opt.textContent = option.label;
          if (input.value !== undefined && option.value === input.value) {
            opt.selected = true;
          }
          field.appendChild(opt);
        });
        break;
      }
      case 'checkbox': {
        field = document.createElement('input');
        field.type = 'checkbox';
        field.checked = Boolean(input.value);
        break;
      }
      case 'number': {
        field = document.createElement('input');
        field.type = 'number';
        if (input.value !== undefined && input.value !== null) {
          field.value = String(input.value);
        }
        break;
      }
      default: {
        field = document.createElement('input');
        field.type = 'text';
        if (input.value !== undefined && input.value !== null) {
          field.value = String(input.value);
        }
      }
    }

    field.id = `field-${input.name}`;
    field.name = input.name;
    field.dataset.type = input.type || 'text';

    if (input.placeholder && input.type !== 'checkbox') {
      field.placeholder = input.placeholder;
    }

    if (input.type === 'checkbox') {
      fieldWrapper.appendChild(field);
      fieldWrapper.appendChild(label);
    } else {
      fieldWrapper.appendChild(label);
      fieldWrapper.appendChild(field);
    }

    formContainer.appendChild(fieldWrapper);
  });
}

function getFormValues(action) {
  const values = {};
  (action.inputs || []).forEach((input) => {
    const field = document.getElementById(`field-${input.name}`);
    if (!field) return;
    switch (input.type) {
      case 'number': {
        values[input.name] = field.value === '' ? null : Number(field.value);
        break;
      }
      case 'checkbox': {
        values[input.name] = field.checked;
        break;
      }
      default: {
        values[input.name] = field.value;
      }
    }
  });
  return values;
}

function setAction(action) {
  descriptionBox.textContent = action.description || '';
  buildForm(action);
  output.textContent = 'Ready to run the selected action.';
}

function populateActions() {
  actionSelect.innerHTML = '';
  actions.forEach((action) => {
    const option = document.createElement('option');
    option.value = action.id;
    option.textContent = action.label;
    actionSelect.appendChild(option);
  });
  setAction(actions[0]);
}

actionSelect.addEventListener('change', () => {
  const action = actions.find((item) => item.id === actionSelect.value);
  if (action) {
    setAction(action);
  }
});

runButton.addEventListener('click', async () => {
  const action = actions.find((item) => item.id === actionSelect.value);
  if (!action) return;
  const values = getFormValues(action);
  try {
    const result = await action.run(values);
    if (result === undefined) {
      output.textContent = 'Action completed.';
    } else if (typeof result === 'string') {
      output.textContent = result;
    } else {
      output.textContent = JSON.stringify(result, null, 2);
    }
  } catch (error) {
    output.textContent = `Error: ${error?.message ?? error}`;
  }
});

populateActions();
