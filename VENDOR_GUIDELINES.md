# Vendor Guidelines for Commercial Distribution

This document outlines the guidelines and best practices for selling and distributing the Odoo MCP Server as a commercial product.

## Product Information

### Product Name
**Odoo MCP Server** - A production-ready Model Context Protocol (MCP) server for Odoo integration

### Version Management
- Follow [Semantic Versioning](https://semver.org/): MAJOR.MINOR.PATCH
- Version format: `1.0.0`, `1.1.0`, `2.0.0`, etc.
- Beta versions should use version < 1.0.0 (e.g., `0.9.0`)
- Each release must have a unique version number

### License
- **Current License**: MIT License
- Allows commercial use, modification, and distribution
- All dependencies use permissive licenses (MIT, ISC, Apache 2.0)
- For proprietary licensing, replace LICENSE file and update package.json

## Product Completeness

### Requirements
- ✅ **Stability**: App should be bug-free and stable
- ✅ **Completeness**: All advertised features must be functional
- ✅ **Documentation**: Complete and accurate documentation required
- ✅ **Installation**: Must be easily installable with provided scripts

### Beta/Development Versions
- Version number must be < 1.0.0
- Clearly mark as "Beta" or "Development" in documentation
- Inform customers about potential issues

## Pricing Guidelines

### Pricing Best Practices
- **Minimum Price**: Set appropriate minimum (suggested: $9 USD / €9 EUR)
- **Price Consistency**: If selling on multiple platforms, maintain consistent or lower pricing on primary platform
- **Promotions**: If offering discounts elsewhere, match or beat on primary platform
- **Currency**: Support EUR and USD (or your primary market currency)

### Refund Policy
- Clearly state refund policy in documentation
- Handle bugs and malfunctions promptly
- Provide support for paid versions
- Free versions may not require support (but recommended)

## Documentation Requirements

### Mandatory Documentation
1. **README.md** - Complete product overview
2. **INSTALLATION.md** - Detailed installation instructions
3. **MCP_CONFIG.md** - MCP client configuration guide
4. **INTEGRATION_GUIDE.md** - Integration examples
5. **LICENSE** - License file
6. **START_HERE.md** - Quick start guide for customers

### Documentation Standards
- All documentation must be in English
- Descriptions must be accurate and not misleading
- Include screenshots/examples where helpful
- List all features clearly
- Document any external service requirements
- Include troubleshooting section

### Feature Documentation
- List all features explicitly
- Do not advertise features that don't exist
- Document any hidden or undocumented features
- Clearly state external service requirements
- Include API documentation

## Data and User Protection

### Customer Data
- **Transparency**: Clearly explain any data collection
- **Privacy Policy**: Include link to privacy policy if collecting data
- **User Consent**: Get opt-in before transmitting data
- **Data Ownership**: Customers own their data at all times

### Security
- No obfuscated or encrypted code (unless clearly documented)
- No malicious code or data theft
- No unauthorized monitoring
- Secure API key storage (bcrypt hashing)
- Rate limiting to prevent abuse

### Vendor Lock-In
- **No Activation Keys**: App should not require activation keys to run
- **Data Portability**: Customers can export their data
- **Open Standards**: Use standard protocols (MCP, REST API)

## Intellectual Property

### Code Ownership
- Code must be your intellectual property
- No plagiarism or copyright infringement
- Respect licenses of dependencies
- Include proper attribution for third-party code

### License Compliance
- Ensure all dependencies have compatible licenses
- Include license notices for dependencies
- Respect MIT, ISC, Apache 2.0 licenses of dependencies

## Quality Standards

### Code Quality
- TypeScript with proper typing
- Error handling throughout
- Logging for debugging
- Security best practices
- Performance optimization

### Testing
- Test on clean systems
- Test installation scripts
- Verify all features work
- Test on multiple platforms (Linux, macOS, Windows)
- Test with different Odoo versions (17, 18, 19+)

### Support
- Provide support email in package.json
- Respond to issues in timely fashion
- Maintain changelog (CHANGELOG.md)
- Provide update mechanism

## Distribution Guidelines

### Package Contents
- ✅ Source code (TypeScript)
- ✅ Installation scripts (install.sh, install.bat)
- ✅ Complete documentation
- ✅ Configuration templates (.env.example)
- ✅ License file
- ✅ Docker support files
- ✅ Package.json with metadata

### Package Quality
- No development files in distribution
- No node_modules in package
- Clean, organized structure
- Proper file permissions
- Executable install scripts

### Version Control
- Use Git for version control
- Tag releases properly
- Maintain changelog
- Document breaking changes

## Marketing and Sales

### Accurate Marketing
- Do not make false claims
- Accurately represent features
- Include real screenshots/examples
- Do not disparage competitors
- Follow fair business practices

### Platform Rules
- Follow platform-specific rules (GitHub, npm, etc.)
- Do not manipulate ratings or reviews
- Do not spam or harass users
- Respect intellectual property

## Support and Maintenance

### Support Requirements
- **Paid Versions**: Support required
- **Free Versions**: Support recommended but not required
- **Response Time**: Respond within reasonable time (suggested: 48 hours)
- **Support Channels**: Email, GitHub Issues, or dedicated support system

### Updates and Maintenance
- Regular security updates
- Bug fixes in timely manner
- Feature updates as needed
- Maintain backward compatibility when possible
- Document breaking changes

## Legal Compliance

### Required Legal Elements
- License file (LICENSE)
- Copyright notice
- Terms of Service (if applicable)
- Privacy Policy (if collecting data)
- Third-party license attributions

### Compliance
- Comply with local laws
- GDPR compliance if handling EU data
- Export compliance if applicable
- Tax compliance for sales

## Enforcement

### Quality Standards
- Maintain high code quality
- Keep documentation up to date
- Respond to security issues promptly
- Fix bugs in reasonable timeframe

### Consequences
- Poor quality may result in negative reviews
- Security issues must be addressed immediately
- False advertising may result in legal issues
- Violation of licenses may result in takedown

## Best Practices Summary

1. **Be Transparent**: Clear documentation, accurate features
2. **Be Responsive**: Quick support response times
3. **Be Secure**: Follow security best practices
4. **Be Legal**: Comply with licenses and laws
5. **Be Professional**: Maintain quality standards
6. **Be Honest**: Accurate marketing and descriptions

## Resources

- [Semantic Versioning](https://semver.org/)
- [MIT License](https://opensource.org/licenses/MIT)
- [GDPR Compliance](https://gdpr.eu/)
- [Open Source Licenses](https://opensource.org/licenses)

---

**Note**: These guidelines are based on industry best practices for commercial software distribution. Adapt as needed for your specific use case and legal requirements.
