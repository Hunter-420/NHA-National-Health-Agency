// Mapping of districts to provinces in Nepal
const nepalDistrictsToProvinces = {
    1: { 
        name: "Koshi",
        districts: [
            "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", 
            "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", 
            "Udayapur"
        ]
    },
    2: { 
        name: "Madesh",
        districts: [
            "Barishal", "Dhanusha", "Mahottari", "Saptari", "Sarlahi", "Sindhuli",
            "Siraha", "Rautahat", "Parsa"
        ]
    },
    3: { 
        name: "Bagmati",
        districts: [
            "Bhaktapur", "Chitwan", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", 
            "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhupalchok", "Dhading", "Rasuwa"
        ]
    },
    4: {
        name: "Gandaki",
        districts: [
            "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Parbat", "Syangja", "Tanahun"
        ]
    },
    5: { 
        name: "Lumbini",
        districts: [
            "Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Nawalparasi", 
            "Palpa", "Rupandehi", "Salyan", "Rolpa", "Rukum", "Pyuthan"
        ]
    },
    6: { 
        name: "Karnali",
        districts: [
            "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Doti", "Kailali", "Kanchanpur",
            "Salyan", "Surkhet", "Udayapur", "Jajarkot", "Humla", "Kalikot", "Mugu"
        ]
    },
    7: { 
        name: "SudurPaschim",
        districts: [
            "Dadeldhura", "Darchula", "Kailali", "Kanchanpur", "Achham", "Baitadi", "Bajhang"
        ]
    }
};

// Function to find the province by district name
const findProvinceByDistrict = (districtName) => {
    // Normalize the district name to avoid case-sensitive issues
    districtName = districtName.trim().toLowerCase();

    // Loop through each province to find the district
    for (let provinceNumber in nepalDistrictsToProvinces) {
        const province = nepalDistrictsToProvinces[provinceNumber];
        if (province.districts.map(d => d.toLowerCase()).includes(districtName)) {
            return `${province.name}`;
        }
    }
    return 'NULL';
}

module.exports = findProvinceByDistrict;

