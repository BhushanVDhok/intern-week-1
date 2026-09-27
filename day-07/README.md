# Day 7 — Next.js + Node.js Backend

## Objective
Learn modern React development with Next.js and build a REST API backend with Node.js/Express.

## Project Overview
A full-stack application featuring:
- **Frontend**: Next.js 14 with App Router (React 18 + TypeScript)
- **Backend**: Express.js REST API
- **Communication**: HTTP with JSON

## Technology Stack

### Frontend (Next.js)
- Next.js 14
- React 18
- TypeScript
- axios for API calls
- CSS3 for styling

### Backend (Express)
- Node.js with Express.js
- RESTful API architecture
- CORS support for frontend integration
- Input validation middleware
- Error handling

## Project Structure
```
day-07/
├── nextjs-app/
│   ├── app/
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── README.md
├── node-api/
│   ├── server.js               # Express server
│   ├── package.json
│   └── README.md (or here)
└── README.md
```

## Frontend Setup (Next.js)

### Installation
```bash
cd nextjs-app
npm install
```

### Commands
```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Production server
```

### Features
- Server-side rendering (SSR) capable
- Static generation for fast performance
- API integration with backend
- Client-side data management with useState/useEffect
- Responsive design
- Form handling with validation

### Key Files

**page.tsx** - Main dashboard component
- Employee CRUD operations
- Search, filter, and sort functionality
- Modal dialogs for add/edit/delete
- Statistics display
- LocalStorage fallback

**layout.tsx** - Root layout with metadata

**globals.css** - Responsive styling

## Backend Setup (Express)

### Installation
```bash
cd node-api
npm install
```

### Commands
```bash
npm run dev      # Development with nodemon (auto-reload)
npm start        # Production server
```

### API Endpoints

#### GET Endpoints
```bash
GET /health
# Returns: { status: "OK", message: "Employee API is running" }

GET /api/employees
# Query params: ?department=Engineering&sort=salary&order=desc
# Returns: { success: true, count: 5, data: [...] }

GET /api/employees/:id
# Returns: { success: true, data: {...} }

GET /api/stats
# Returns: { success: true, data: { totalEmployees, averageSalary, departments } }
```

#### POST Endpoint
```bash
POST /api/employees
# Body: { name, email, department, position, salary, joinDate }
# Returns: { success: true, message: "...", data: {...} }
```

#### PUT Endpoint
```bash
PUT /api/employees/:id
# Body: { name, email, department, position, salary, joinDate }
# Returns: { success: true, message: "...", data: {...} }
```

#### DELETE Endpoint
```bash
DELETE /api/employees/:id
# Returns: { success: true, message: "...", data: {...} }
```

### Request/Response Examples

**Create Employee**
```json
POST /api/employees
Content-Type: application/json

{
  "name": "Peter Parker",
  "email": "jane.smith@company.com",
  "department": "Engineering",
  "position": "Senior Developer",
  "salary": 130000,
  "joinDate": "2023-01-15"
}

Response:
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 6,
    "name": "Peter Parker",
    ...
  }
}
```

**Filter Employees**
```bash
GET /api/employees?department=Engineering&sort=salary&order=desc
```

### Middleware
1. **CORS** - Allows cross-origin requests from frontend
2. **Body Parser** - Parses JSON request bodies
3. **Validation** - Validates employee data before operations
4. **Error Handler** - Centralized error handling

## API Architecture

### Request Flow
```
Client Request
    ↓
Express Middleware (CORS, bodyParser)
    ↓
Route Handler
    ↓
Validation Middleware
    ↓
Business Logic (CRUD)
    ↓
Response (JSON)
```

### Error Handling
- 400: Bad Request (validation error)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

### Data Validation
- Name: Required, non-empty
- Email: Required, valid format
- Department: Required, non-empty
- Position: Required, non-empty
- Salary: Required, > 0
- Join Date: Required, valid date

## Integration Between Frontend and Backend

### Frontend Configuration
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Call Example
const response = await axios.get(`${API_URL}/employees`);
```

### CORS Configuration (Backend)
```javascript
app.use(cors());  // Allows all origins in dev
```

## Running Both Servers

### Terminal 1: Start Backend
```bash
cd day-07/node-api
npm run dev
# Runs on http://localhost:3001
```

### Terminal 2: Start Frontend
```bash
cd day-07/nextjs-app
npm run dev
# Runs on http://localhost:3000
```

## Testing the API

### Using cURL
```bash
# Get all employees
curl http://localhost:3001/api/employees

# Create employee
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","department":"IT","position":"Developer","salary":80000,"joinDate":"2023-01-01"}'

# Update employee
curl -X PUT http://localhost:3001/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","email":"updated@example.com",...}'

# Delete employee
curl -X DELETE http://localhost:3001/api/employees/1
```

### Using Postman
1. Import endpoints
2. Set up environment variables
3. Test each endpoint
4. Save collection for documentation

## Performance Considerations

### Frontend
- Next.js automatic code splitting
- Image optimization
- Font optimization
- Lazy loading of components

### Backend
- In-memory data storage (no database)
- Efficient filtering/sorting
- Proper error responses
- Middleware optimization

## Security Considerations

### Frontend
- Input validation before submission
- XSS prevention through React escaping
- HTTPS in production

### Backend
- CORS configuration
- Input validation on every endpoint
- SQL injection prevention (no SQL used)
- Rate limiting (not implemented - for production)
- Authentication (not implemented - for production)

### Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

**Backend (.env)**
```
PORT=3001
NODE_ENV=production
```

## Challenges Faced
1. **CORS Configuration**: Exposing backend API to frontend
2. **API Integration**: Coordinating requests and responses
3. **State Management**: Managing complex state in both frontend and backend
4. **Error Handling**: Consistent error responses
5. **Validation**: Duplicating validation in frontend and backend

## Solutions Implemented
1. CORS middleware enables cross-origin requests
2. Axios for simplified HTTP requests
3. useEffect hooks for API calls
4. Centralized API error handling
5. Server-side validation with feedback

## Concepts Demonstrated

### Frontend (Next.js)
- App Router
- Server and Client Components
- API Integration
- Form Handling
- State Management
- Responsive Design

### Backend (Express)
- Route Definition
- Middleware
- Validation
- CRUD Operations
- Error Handling
- RESTful Principles

## Future Improvements
1. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: JWT-based authentication
3. **Document API**: Swagger/OpenAPI documentation
4. **Testing**: Unit and integration tests
5. **Deployment**: Docker containerization
6. **Logging**: Request/response logging
7. **Caching**: Redis for performance
8. **Pagination**: Handle large datasets
9. **Rate Limiting**: Prevent abuse
10. **GraphQL**: Alternative to REST API

## Learning Outcomes
By completing this project, you understand:
- Next.js App Router and file-based routing
- Server vs Client Components
- Express.js middleware architecture
- RESTful API design principles
- HTTP methods and status codes
- API integration from frontend
- Form submission and handling
- Error handling patterns
- Deployment strategies

---
