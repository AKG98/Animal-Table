class Animal {
    constructor(data, image = 'https://via.placeholder.com/100') {
        Object.assign(this, data);
        this.image = this.image || image;
    }
}

class AnimalTableManager {
    constructor(tableId, animalType, sortableFields, nameStyle) {
        this.tableId = tableId;
        this.animalType = animalType;
        this.sortableFields = sortableFields;
        this.nameStyle = nameStyle;
        this.animals = [];
        this.currentPage = 1;
        this.rowsPerPage = 4;
        this.currentSortField = null;
        this.sortDirection = 'asc';
        this.loadData();
    }

    async loadData() {
        try {
            const response = await fetch(`/src/data/${this.animalType}.json`);
            const data = await response.json();
            
            this.animals = data
                .filter(animal => animal.species.toLowerCase() === this.getSpeciesType())
                .map(animal => new Animal(animal));
            
            this.render();
        } catch (error) {
            console.error(`Error loading ${this.animalType} data:`, error);
            this.animals = [];
            this.render();
        }
    }
    getSpeciesType() {
        switch(this.animalType) {
            case 'bigCats':
                return 'big cat';
            case 'dogs':
                return 'dog';
            case 'bigFish':
                return 'big fish';
            default:
                return this.animalType.toLowerCase();
        }
    }

    formatAnimalType(type) {
        const words = type.split(/(?=[A-Z])/);
        const formattedWords = words.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        );
        return formattedWords.join(' ');
    }

    getTotalPages() {
        return Math.max(1, Math.ceil(this.animals.length / this.rowsPerPage));
    }

    getCurrentPageData() {
        const totalPages = this.getTotalPages();
        this.currentPage = Math.min(this.currentPage, totalPages);

        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        return this.animals.slice(startIndex, endIndex);
    }

    setPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.render();
        }
    }

    addAnimal(animal) {
        if (this.animals.some(a => a.name.toLowerCase() === animal.name.toLowerCase())) {
            alert('Animal with this name already exists!');
            return false;
        }
        this.animals.push(animal);
        
        this.currentPage = this.getTotalPages();
        this.render();
        return true;
    }

    deleteAnimal(name) {
        this.animals = this.animals.filter(a => a.name !== name);
        
        const totalPages = this.getTotalPages();
        this.currentPage = Math.min(this.currentPage, totalPages);
        
        this.render();
    }

    editAnimal(oldName, updatedAnimal) {
        const index = this.animals.findIndex(a => a.name === oldName);
        if (index !== -1) {
            this.animals[index] = updatedAnimal;
            this.render();
        }
    }

    sortBy(field) {
        if (!this.sortableFields.includes(field)) return;

        if (this.currentSortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSortField = field;
            this.sortDirection = 'asc';
        }

        this.animals.sort((a, b) => {
            let comparison = 0;
            if (typeof a[field] === 'string') {
                comparison = a[field].localeCompare(b[field]);
            } else {
                comparison = a[field] - b[field];
            }
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });

        this.currentPage = 1;
        this.render();
    }

    getSortIcon(field) {
        if (!this.sortableFields.includes(field)) {
            return '';
        }

        if (this.currentSortField === field) {
            return this.sortDirection === 'asc' ? '<i class="bi bi-sort-down"></i>' : '<i class="bi bi-sort-up"></i>';
        }
        return '<i class="bi bi-sort-up"></i>';
    }

    getNameCell(name) {
        switch (this.nameStyle) {
            case 'bold':
                return `<strong>${name}</strong>`;
            case 'boldItalicBlue':
                return `<strong><em class="blue-text">${name}</em></strong>`;
            default:
                return name;
        }
    }

    renderPagination() {
        const totalPages = this.getTotalPages();
        let pagination = '<ul class="pagination pagination-sm justify-content-center">';

        pagination += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="tableManager['${this.tableId}'].setPage(${this.currentPage - 1}); return false;"><i class="bi bi-arrow-left-short"></i></a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            pagination += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="tableManager['${this.tableId}'].setPage(${i}); return false;">${i}</a>
                </li>
            `;
        }

        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="tableManager['${this.tableId}'].setPage(${this.currentPage + 1}); return false;"><i class="bi bi-arrow-right-short"></i></a>
            </li>
        `;

        pagination += '</ul>';
        return pagination;
    }

    render() {
        const table = document.getElementById(this.tableId);
        if (this.animals.length === 0) {
            table.innerHTML = `
                <div class="alert alert-info">
                    No ${this.formatAnimalType(this.animalType)} found. 
                    <button class="btn btn-dark btn-sm px-4 ml-2" onclick="showAddModal('${this.tableId}')">
                        + Add ${this.formatAnimalType(this.animalType)}
                    </button>
                </div>
            `;
            return;
        }

        const allColumns = Object.keys(this.animals[0] || {});
    
        const headerRow = allColumns
            .filter(field => field !== 'image' && field !== 'id')
            .map(field => {
            
            const isSortable = this.sortableFields.includes(field);
            const className = isSortable ? 'sortable' : 'non-sortable';
            const clickHandler = isSortable ? 
                `onclick="tableManager['${this.tableId}'].sortBy('${field}')"` : '';
            
            return `<th class="${className}" ${clickHandler}>
                ${field.charAt(0).toUpperCase() + field.slice(1)}
                <span class="sort-icon" style="font-size: 0.8rem;">
                    ${this.getSortIcon(field)}
                </span>
            </th>`;
        }).join('');
    
        const currentPageData = this.getCurrentPageData();
    
        const rows = currentPageData.map(animal => {
            const cells = allColumns
                .filter(field => field !== 'image' && field !== 'id')
                .map(field => {
                    if (field === 'name') {
                        return `<td class="py-4">${this.getNameCell(animal[field])}</td>`;
                    } else if (field === 'size') {
                        return `<td class="py-4">${animal[field] ? animal[field] + ' ft' : ''}</td>`;
                    } else {
                        return `<td class="py-4">${animal[field]}</td>`;
                    }
                }).join('');
    
            return `
                <tr>
                    ${cells}
                    <td>
                        <div class="animal-wrapper px-5" style="--hover-image: url('${animal.image}')">
                            <img src="${animal.image}" alt="${animal.name}" class="animal-image">
                        </div>
                    </td>
                    <td class="py-4">
                        <button class="btn btn-sm" onclick="editAnimal('${this.tableId}', '${animal.name}')">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm" onclick="deleteAnimal('${this.tableId}', '${animal.name}')">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    
        const startIndex = (this.currentPage - 1) * this.rowsPerPage + 1;
        const endIndex = Math.min(startIndex + currentPageData.length - 1, this.animals.length);
    
        table.innerHTML = `
            <div class="d-flex justify-content-between align-items-baseline">
                <div class="page-info">
                    Showing ${startIndex} to ${endIndex} of ${this.animals.length} entries
                </div>
                <div class="mb-3">
                    <button class="btn btn-dark btn-sm px-4" onclick="showAddModal('${this.tableId}')">
                        + Add ${this.formatAnimalType(this.animalType)}
                    </button>
                </div>
            </div>
            <table class="table table-hover border">
                <thead class="bg-dark text-white">
                    <tr>
                        ${headerRow}
                        <th class="px-5">Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            
            ${this.renderPagination()}
        `;
    }
}

