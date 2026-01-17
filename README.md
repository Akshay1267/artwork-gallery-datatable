# Artwork Gallery DataTable

A modern React TypeScript application featuring an interactive artwork gallery with server-side pagination and persistent row selection. Built using PrimeReact DataTable and the Art Institute of Chicago API.

## 🚀 Live Demo

[View Live Demo](https://artwork-gallery-datatable.netlify.app/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Key Implementation Details](#key-implementation-details)
- [Assignment Requirements](#assignment-requirements)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **Server-Side Pagination**: Efficient data loading with lazy fetching from API
- **Persistent Row Selection**: Selected rows remain selected across page navigation
- **Custom Bulk Selection**: Select multiple rows via an intuitive overlay panel
- **Responsive Design**: Fully responsive table layout with mobile support
- **Real-time Selection Counter**: Visual feedback showing total selected rows
- **Error Handling**: Graceful error handling with user-friendly messages

### User Experience
- ✅ Individual row selection via checkboxes
- ✅ Select/deselect all rows on current page
- ✅ Custom number input for bulk selection
- ✅ Loading indicators during data fetch
- ✅ Hover effects on table rows
- ✅ Clean, modern UI with Tailwind CSS

## 🛠 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: PrimeReact
- **Styling**: Tailwind CSS
- **API**: Art Institute of Chicago API
- **State Management**: React Hooks (useState, useEffect, useCallback)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshay1267/artwork-gallery-datatable.git
   cd artwork-gallery-datatable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🎯 Usage

### Basic Navigation
- Use pagination controls at the bottom to navigate between pages
- Click on individual checkboxes to select/deselect rows
- Use the header checkbox to select/deselect all rows on the current page

### Custom Selection
1. Click the **"Custom Select"** button in the top-right corner
2. Enter the number of rows you want to select
3. Click **"Submit"**
4. Rows from the current page will be selected up to the specified count

### Persistent Selection
- Selected rows remain selected when you navigate to other pages
- Return to any page and your previous selections will still be active
- Selection state is maintained in memory using row IDs

## 📁 Project Structure

```
artwork-gallery-datatable/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.tsx           # Main application component
│   ├── App.css           # Component styles
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔑 Key Implementation Details

### 1. Server-Side Pagination
```typescript
const fetchArtworks = useCallback(async (page: number) => {
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}`
  );
  const data: ApiResponse = await response.json();
  setArtworks(data.data);
  setTotalRecords(data.pagination.total);
  setRowsPerPage(data.pagination.limit); // Dynamic from API
}, []);
```

**Why it's efficient:**
- Only fetches data for the current page
- Uses API's pagination metadata
- Dynamically adapts to API's rows per page

### 2. Persistent Selection Strategy
```typescript
const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
```

**How it works:**
- Stores only row IDs (not entire row objects)
- Uses `Set<number>` for O(1) lookup performance
- Selection state persists in memory across page changes
- **No prefetching** or mass data storage

### 3. Custom Selection (Current Page Only)
```typescript
const handleCustomSelection = () => {
  const rowsToSelect = artworks.slice(0, 
    Math.min(customSelectCount, artworks.length)
  );
  
  const updatedSelectedIds = new Set(selectedIds);
  rowsToSelect.forEach(row => updatedSelectedIds.add(row.id));
  setSelectedIds(updatedSelectedIds);
};
```

**Compliant with requirements:**
- ✅ Only selects from currently loaded page
- ✅ No API calls to other pages
- ✅ No prefetching or storing of other page data
- ✅ User-friendly feedback for edge cases

### 4. Performance Optimization
```typescript
// Memoized callbacks prevent unnecessary re-renders
const fetchArtworks = useCallback(async (page: number) => {...}, []);
const getSelectedArtworks = useCallback(() => {...}, [artworks, selectedIds]);
const onSelectionChange = useCallback((e) => {...}, [artworks, selectedIds]);
```

## 📝 Assignment Requirements

### ✅ All Requirements Met

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Vite + TypeScript | ✅ | Project initialized with Vite, strict TypeScript |
| PrimeReact DataTable | ✅ | Using official DataTable component with lazy loading |
| Server-side pagination | ✅ | Fetches data per page with `lazy={true}` |
| All 6 data fields | ✅ | title, place_of_origin, artist_display, inscriptions, date_start, date_end |
| Row selection | ✅ | Individual + select all functionality |
| Custom selection panel | ✅ | OverlayPanel with InputNumber |
| Persistent selection | ✅ | Set<number> stores IDs across pages |
| No prefetching | ✅ | Only current page data loaded |
| No mass storage | ✅ | Only IDs stored, not objects |

### 🚫 Forbidden Patterns Avoided
- ❌ No loops fetching multiple pages
- ❌ No storing of row objects from other pages
- ❌ No prefetching of data
- ❌ No hardcoded pagination values (uses API response)

## 📊 Data Fields

The application displays the following artwork information:

| Field | Description |
|-------|-------------|
| **Title** | Name of the artwork |
| **Place of Origin** | Geographic origin of the piece |
| **Artist** | Artist name and details |
| **Inscriptions** | Any text inscribed on the artwork |
| **Date Start** | Beginning of creation period |
| **Date End** | End of creation period |

## 🎨 Screenshots

### Main Gallery View
![Main View](screenshots/main-view.png)
*Gallery showing artworks with pagination and selection*

### Custom Selection Panel
![Custom Selection](screenshots/custom-selection.png)
*Overlay panel for bulk row selection*

### Persistent Selection
![Persistent Selection](screenshots/persistent-selection.png)
*Selected rows remain selected across pages*

## 🔧 Build & Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify

1. **Via Netlify UI**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod
   ```

## 🧪 Testing the Application

### Manual Testing Checklist

- [ ] Page 1 loads with artwork data
- [ ] Can navigate to different pages using pagination
- [ ] Individual row selection works
- [ ] Select all checkbox selects all rows on current page
- [ ] Custom selection dialog opens
- [ ] Can input number and select N rows
- [ ] Selected rows persist when changing pages
- [ ] Returning to page 1 shows previous selections
- [ ] Alert shows when requesting more rows than available
- [ ] Loading indicator appears during data fetch
- [ ] Responsive layout works on mobile

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Akshay Jain**
- GitHub: [@Akshay1267](https://github.com/Akshay1267)
- LinkedIn: (https://www.linkedin.com/in/akshay-jain-8816252a5/)

## 🙏 Acknowledgments

- [Art Institute of Chicago API](https://api.artic.edu/docs/) for providing the artwork data
- [PrimeReact](https://primereact.org/) for the DataTable component
- [Vite](https://vitejs.dev/) for the blazing fast build tool

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and PrimeReact**
