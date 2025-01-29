// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module sui::nitro_attestation;

use sui::clock::{Self, Clock};

#[allow(unused_const)]
/// Error that the feature is not available on this network.
const ENotSupportedError: u64 = 0;
#[allow(unused_const)]
/// Error that the attestation input failed to be parsed. 
const EParseError: u64 = 1;
#[allow(unused_const)]
/// Error that the attestation failed to be verified. 
const EVerifyError: u64 = 2;
#[allow(unused_const)]
/// Error that the pcrs length is invalid. 
const EInvalidPcrLength: u64 = 3;

/// Represents a PCR entry with an index and value.
public struct PCREntry has drop {
    index: u8,
    value: vector<u8>
}

/// Nitro Attestation Document defined for AWS.
public struct NitroAttestationDocument has drop  {
    /// Version
    version: u8,
    /// Issuing Nitro hypervisor module ID.
    module_id: vector<u8>,
    /// UTC time when document was created, in milliseconds since UNIX epoch.
    timestamp: u64,
    /// The digest function used for calculating the register values.
    digest: vector<u8>,
    /// The map of all locked PCRs at the moment the attestation document was generated.
    /// The array contains PCR0, PCR1, PCR2, PCR3, PCR4, PCR8. See more 
    ///  <https://docs.aws.amazon.com/enclaves/latest/user/set-up-attestation.html#where>.
    pcrs: vector<vector<u8>>,
    /// An optional DER-encoded key the attestation, consumer can use to encrypt data with.
    public_key: Option<vector<u8>>,
    /// Additional signed user data, defined by protocol.
    user_data: Option<vector<u8>>,
    /// An optional cryptographic nonce provided by the attestation consumer as a proof of 
    /// authenticity.
    nonce: Option<vector<u8>>,
}

/// Internal native function
native fun verify_nitro_attestation_internal(
    attestation: &vector<u8>,
    current_timestamp: u64
): NitroAttestationDocument;

/// @param attestation: attesttaion documents bytes data. 
/// @param clock: the clock object.
///
/// Returns parsed NitroAttestationDocument after verifying the attestation.
public fun verify_nitro_attestation(
    attestation: &vector<u8>,
    clock: &Clock
): NitroAttestationDocument {
    verify_nitro_attestation_internal(attestation, clock::timestamp_ms(clock))
}

public fun version(attestation: &NitroAttestationDocument): &u8 {
    &attestation.version
}

public fun module_id(attestation: &NitroAttestationDocument): vector<u8> {
    attestation.module_id
}

public fun timestamp(attestation: &NitroAttestationDocument): &u64 {
    &attestation.timestamp
}

public fun digest(attestation: &NitroAttestationDocument): &vector<u8> {
    &attestation.digest
}

/// Returns a list of mapping from index to the pcr itself. Currently AWS supports 
///PCR0, PCR1, PCR2, PCR3, PCR4, PCR8. 
public fun pcrs(attestation: &NitroAttestationDocument): vector<PCREntry> {
    assert!(attestation.pcrs.length() == 6, EInvalidPcrLength);
    let mut result: vector<PCREntry> = vector::empty();
    let indices = vector[0, 1, 2, 3, 4, 8];
    let mut i = 0;
    while (i < attestation.pcrs.length()) {
        result.push_back(PCREntry {
            index: indices[i],
            value: attestation.pcrs[i]
        });
        i = i + 1;
    };
    result
}

public fun public_key(attestation: &NitroAttestationDocument): &Option<vector<u8>> {
    &attestation.public_key
}

public fun user_data(attestation: &NitroAttestationDocument): &Option<vector<u8>> {
    &attestation.user_data
}

public fun nonce(attestation: &NitroAttestationDocument): &Option<vector<u8>> {
    &attestation.nonce
}

public fun index(entry: &PCREntry): u8 {
    entry.index
}

public fun value(entry: &PCREntry): &vector<u8> {
    &entry.value
}
