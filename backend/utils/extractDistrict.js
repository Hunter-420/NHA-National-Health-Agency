const extractDistrict = (address) => {
    // Split the address by commas
    const parts = address.split(',');

    // Trim whitespace for each part
    const trimmedParts = parts.map(part => part.trim());

    // If there are multiple parts, the district is often the last part (handle case 1)
    const lastPart = trimmedParts[trimmedParts.length - 1];

    // If the last part is a country name (e.g., Nepal), the district should be the second last part (handle case 2)
    if (trimmedParts.length > 1 && lastPart.toLowerCase() === 'nepal') {
        return trimmedParts[trimmedParts.length - 2];
    }

    // Default case: The district is the last part
    return lastPart;
}

module.exports = extractDistrict