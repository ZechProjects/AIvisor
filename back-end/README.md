# AIvisor
Agentic Ethereum 2025 Hackathon Project Submission

## API Documentation

### AI Agents Endpoints

#### Get All AI Agents
- **GET** `/api/ai/agents`
- **Description**: Retrieves a list of all AI agents from the database
- **Response**:
  - `200`: List of AI agents
  - `500`: Server error

#### Get AI Suggestion
- **POST** `/api/ai/suggest`
- **Description**: Returns a suggestion from the AI based on provided input
- **Request Body**:
  ```json
  {
    "prompt": "string",
    "agentId": "string"
  }
  ```
- **Response**:
  - `200`: AI suggestion
  - `400`: Invalid request parameters
  - `404`: AI agent not found
  - `500`: Server error

### Trading Endpoints

#### Execute Trade
- **POST** `/api/trade`
- **Description**: Execute a cryptocurrency trade
- **Request Body**:
  ```json
  {
    "userId": "string",
    "crypto": "string",
    "type": "BUY" | "SELL",
    "amount": "number",
    "price": "number"
  }
  ```
- **Response**:
  - `200`: Trade executed successfully
  - `400`: Invalid request or insufficient balance
  - `404`: User not found
  - `500`: Server error

### User Endpoints

#### Create User
- **POST** `/api/users`
- **Request Body**:
  ```json
  {
    "username": "string"
  }
  ```
- **Response**:
  - `201`: User created successfully
  - `500`: Server error

#### User Operations
- **GET** `/api/users/{id}`: Get user by ID
- **PUT** `/api/users/{id}`: Update user
- **DELETE** `/api/users/{id}`: Delete user
- **Response**:
  - `200`: Operation successful
  - `404`: User not found
  - `500`: Server error

#### Get User Portfolio
- **GET** `/api/users/{id}/portfolio`
- **Response**:
  - `200`: Portfolio retrieved successfully
  - `404`: User not found
  - `500`: Server error

### Authentication Endpoints

#### Login
- **POST** `/api/login`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200`: Login successful (returns token and userId)
  - `401`: Invalid credentials
  - `500`: Server error

#### Logout
- **POST** `/api/logout`
- **Response**:
  - `200`: Logout successful

#### Password Reset
- **POST** `/api/request-reset`
  - Request password reset token
  - Requires username in request body
- **POST** `/api/reset-password`
  - Reset password using token
  - Requires resetToken and newPassword in request body
- **Response**:
  - `200`: Operation successful
  - `400`: Invalid/expired token (for reset)
  - `404`: User not found (for request)
  - `500`: Server error

#### Register User
- **POST** `/api/register`
- **Description**: Register a new user with initial USDT balance
- **Request Body**:
  ```json
  {
    "username": "string", // 3-20 characters
    "password": "string"  // minimum 8 characters
  }
  ```
- **Response**:
  - `201`: Registration successful
    ```json
    {
      "token": "string",
      "userId": "string",
      "username": "string",
      "usdtBalance": 10000
    }
    ```
  - `400`: Validation errors
    - Username already exists
    - Invalid username length
    - Invalid password length
    - Missing required fields
  - `500`: Server error
