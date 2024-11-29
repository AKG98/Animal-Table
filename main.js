const tableManager = {
    bigCatsTable: new AnimalTableManager('bigCatsTable', 'bigCats', ['name', 'location', 'size'], 'normal'),
    dogsTable: new AnimalTableManager('dogsTable', 'dogs', ['name', 'location'], 'bold'),
    bigFishTable: new AnimalTableManager('bigFishTable', 'bigFish', ['size'], 'boldItalicBlue')
};

function getSpeciesForTable(tableId) {
    switch(tableId) {
        case 'bigCatsTable':
            return 'big cat';
        case 'dogsTable':
            return 'dog';
        case 'bigFishTable':
            return 'big fish';
        default:
            return '';
    }
}

function isValidUrl(url) {
    const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlRegex.test(url);
}

function showAddModal(tableId) {
    const modal = new bootstrap.Modal(document.getElementById('animalModal'));
    const speciesSelect = document.getElementById('speciesInput');
    document.querySelector('.modal-title').textContent = `Add ${tableManager[tableId].animalType}`;

    document.getElementById('animalForm').reset();    
    const defaultSpecies = getSpeciesForTable(tableId);
    speciesSelect.value = defaultSpecies;
    
    speciesSelect.disabled = true;

    document.getElementById('saveAnimal').onclick = () => saveAnimal(tableId);

    modal.show();
}

function editAnimal(tableId, name) {
    const animal = tableManager[tableId].animals.find(a => a.name === name);
    if (!animal) return;

    const modal = new bootstrap.Modal(document.getElementById('animalModal'));
    document.querySelector('.modal-title').textContent = `Edit ${animal.name}`;

    document.getElementById('nameInput').value = animal.name;
    document.getElementById('locationInput').value = animal.location;
    document.getElementById('sizeInput').value = animal.size;
    document.getElementById('imageInput').value = animal.image || '';
    
    const speciesInput = document.getElementById('speciesInput');
    speciesInput.value = getSpeciesForTable(tableId);
    speciesInput.disabled = true;

    document.getElementById('saveAnimal').onclick = () => {
        const updatedData = {
            name: document.getElementById('nameInput').value.trim(),
            location: document.getElementById('locationInput').value.trim(),
            size: parseInt(document.getElementById('sizeInput').value.trim()),
            species: document.getElementById('speciesInput').value,
            image: document.getElementById('imageInput').value.trim()
        };

        const errors = [];
        if (!updatedData.name) errors.push('Name is required');
        if (!updatedData.location) errors.push('Location is required');
        if (!updatedData.size) errors.push('Size is required');
        if (!updatedData.species) errors.push('Species is required');
        if (updatedData.image && !isValidUrl(updatedData.image)) errors.push('Image URL is invalid');

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const updatedAnimal = new Animal({...animal, ...updatedData});

        tableManager[tableId].editAnimal(name, updatedAnimal);
        bootstrap.Modal.getInstance(document.getElementById('animalModal')).hide();
    };

    modal.show();
}

function deleteAnimal(tableId, name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        tableManager[tableId].deleteAnimal(name); 
    }
}

function saveAnimal(tableId) {
    const name = document.getElementById('nameInput').value.trim();
    const location = document.getElementById('locationInput').value.trim();
    const size = document.getElementById('sizeInput').value.trim();
    const image = document.getElementById('imageInput').value.trim();
    const species = document.getElementById('speciesInput').value;

    const errors = [];
    if (!name) errors.push('Name is required');
    if (!location) errors.push('Location is required');
    if (!size) errors.push('Size is required');
    if (!species) errors.push('Species is required');
    if (image && !isValidUrl(image)) errors.push('Image URL is invalid');

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    if (tableManager[tableId].animals.some(a => a.name.toLowerCase() === name.toLowerCase())) {
        alert('Animal with this name already exists!');
        return;
    }

    const data = {
        name,
        location,
        size: parseInt(size),
        species
    };

    if (image) {
        data.image = image;
    }

    const newAnimal = new Animal(data);

    if (tableManager[tableId].addAnimal(newAnimal)) {
        bootstrap.Modal.getInstance(document.getElementById('animalModal')).hide();
        document.getElementById('animalForm').reset();
    }
}

document.getElementById('animalModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('speciesInput').disabled = false;
});
