#  Zoo Base: Animal Database

## Project Overview
Zoo Base is an interactive web application designed to manage and display information about animals across different species categories. The dashboard provides a user-friendly interface for viewing, adding, editing, and deleting animal records for big cats, dogs, and big fish.

##  Key Features
- **Dynamic Tabbed Interface**: Switch between different animal categories
- **Responsive Data Tables**: 
  - Pagination support
  - Sortable columns
  - Custom styling options
- **CRUD Operations**: 
  - Add new animals
  - Edit existing animal details
  - Delete animal records
- **Image Support**: 
  - Custom or default placeholder images
  - Hover image preview
- **Error Handling**: 
  - Validation for animal data
  - Duplicate name prevention
  - Loading states

## Technologies Used
- HTML5
- Bootstrap 5
- JavaScript (ES6+)
- Bootstrap CSS
- Bootstrap Icons

##  Design Approach
### Design Philosophy
The application was developed with a focus on:
- **Flexibility**: Ability to handle multiple animal categories
- **User Experience**: Intuitive interface with easy navigation
- **Modularity**: Separating concerns and creating reusable components

### Architectural Design Principles
1. **Separation of Concerns**
   - `Animal` class handles individual animal data representation
   - `AnimalTableManager` manages table-specific logic
   - Main JavaScript handles user interactions
   - Data stored separately in JSON files

2. **Dynamic Rendering**
   - Tables are dynamically generated based on data
   - Supports different styling for different animal categories
   - Flexible pagination and sorting mechanisms

3. **Extensibility**
   - Easy to add new animal categories
   - Configurable table properties (sortable fields, name styling)
   - Modular class design allows for easy future enhancements

### Design Patterns Implemented
- Object-Oriented Programming (OOP)
- Modular Design
- Factory Pattern for creating animal instances
- Strategy Pattern for table rendering

### Key Design Decisions
- **Data Loading**: 
  - Asynchronous data fetching
  - Fallback to empty state if no data
  - Loading spinner for better UX

- **State Management**: 
  - Pagination state within `AnimalTableManager`
  - Sorting state tracking

- **Error Handling**:
  - Duplicate name prevention
  - Form validation
  - Graceful error display

### Performance Considerations
- Minimal DOM manipulation
- Efficient sorting algorithms
- Pagination to limit rendered items
- Placeholder images to improve load times

## Project Structure
```
animal-table/
│
├── index.html
├── main.js
│
├── src/
│   ├── class/
│   │   └── animals.js
│   ├── data/
│   │   ├── bigCats.json
│   │   ├── dogs.json
│   │   └── bigFish.json
│   └── styles/
│       └── styles.css
│
└── public/
    └── logo.png
```

## Installation
1. Clone the repository
2. Open `index.html` in a modern web browser
3. No additional setup required

## Usage
1. Select an animal category tab (Big Cats, Dogs, Big Fish)
2. View existing animals in the table
3. Use buttons to:
   - Add new animals
   - Edit existing animals
   - Delete animals
4. Sort columns by clicking column headers
5. Navigate through pages using pagination controls

## Author
### Avinash Gupta
