# Contracts: QR-Text Local-First

**Status**: ❌ Not Applicable  
**Reason**: This project has no external interfaces requiring formal contracts

## Why No Contracts?

According to Spec Kit workflow, the `contracts/` directory documents the interface contracts for projects that expose functionality to external consumers. Examples include:

- **Libraries**: Public API documentation
- **CLI Tools**: Command schemas and argument specifications  
- **Web Services**: REST API endpoints, GraphQL schemas
- **Web Components**: Custom element APIs
- **npm Packages**: Exported functions and types

**This project is none of the above.**

---

## Project Classification

**QR-Text Local-First** is a **self-contained single-page web application** with:
- ✅ User-facing UI only (no programmatic interface)
- ✅ No backend/API to expose
- ✅ No library exports (not an npm package)
- ✅ No CLI commands (browser-based only)
- ✅ No inter-service communication (standalone app)

**External "interface"**: The HTML page itself (URL-addressable web app)

---

## User Interface as Contract

While there are no *programmatic* contracts, the **user interface is the contract** between the application and its users. This is documented in:

- **spec.md**: User stories and acceptance scenarios define the UX contract
- **quickstart.md**: End-user documentation of how to use the app
- **data-model.md**: Internal state (not exposed to external consumers)

---

## If This Changes

If future features introduce programmatic interfaces (e.g., "embed QR generator in other apps", "URL API for dynamic QR codes"), contracts would be documented here:

**Example (hypothetical)**:
```
contracts/
├── url-api.md              # Query parameter schema for dynamic QR generation
└── embed-options.md        # <iframe> embedding contract
```

But as of the current spec (v2.0), **no such interfaces exist**.

---

## Constitutional Alignment

This decision aligns with:
- **Principle I (Local Seclusion)**: No external APIs reduces attack surface
- **Simplicity Governance**: No unnecessary abstraction layers
- **Zero-Latency UI**: No time wasted on contract negotiations/validations

**Conclusion**: The absence of contracts is a *feature*, not an oversight.
