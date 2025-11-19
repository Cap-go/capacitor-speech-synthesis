# Contributing to @capgo/capacitor-speech-synthesis

Thank you for your interest in contributing! We appreciate your help in making this plugin better.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/capacitor-speech-synthesis.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Workflow

### Making Changes

1. Make your changes to the source code
2. Run linting: `npm run lint`
3. Format code: `npm run fmt`
4. Build the plugin: `npm run build`
5. Test your changes on all platforms if possible

### Testing

- **iOS**: Run `npm run verify:ios`
- **Android**: Run `npm run verify:android`
- **Web**: Run `npm run verify:web`
- **All platforms**: Run `npm run verify`

### Code Style

- Follow the existing code style
- Use TypeScript for all source files
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

### Commit Messages

We follow conventional commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for test changes
- `chore:` for maintenance tasks

Example: `feat: add support for custom audio output devices`

## Pull Request Process

1. Update the README.md if needed
2. Update the CHANGELOG.md with your changes
3. Ensure all tests pass
4. Push your changes to your fork
5. Create a pull request to the main repository
6. Wait for review and address any feedback

## Bug Reports

When reporting bugs, please include:

- Plugin version
- Platform (iOS/Android/Web) and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Code snippet if applicable

## Feature Requests

Feature requests are welcome! Please:

- Check if the feature already exists
- Clearly describe the use case
- Provide examples of how it would be used
- Consider submitting a pull request

## Questions?

If you have questions, feel free to:

- Open an issue with the `question` label
- Reach out to the maintainers

Thank you for contributing!
