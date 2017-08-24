// certificates chain order
/*
-----BEGIN CERTIFICATE-----
(Your Primary SSL certificate: your_domain_name.crt) // This one is not needed
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(Your Intermediate certificate: DigiCertCA.crt)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(Your Root certificate: TrustedRoot.crt)
-----END CERTIFICATE-----
*/

// const kgcerts = `
// -----BEGIN CERTIFICATE-----
// ...
// -----END CERTIFICATE-----
// -----BEGIN CERTIFICATE-----
// ...
// -----END CERTIFICATE-----
// `

const kgcerts = undefined

module.exports = { kgcerts }
