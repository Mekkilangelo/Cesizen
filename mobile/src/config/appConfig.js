// App-wide configuration settings
export default {
  // API configuration
  api: {
    // Replace with your computer's local network IP address 
    // Use ipconfig (Windows) or ifconfig (Mac/Linux) to find it
    baseUrl: 'http://localhost:5001/api',
    timeout: 10000,
  },
  
  // UI configuration
  ui: {
    // Use a reliable placeholder service or base64 encoded small image
    placeholderImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAByklEQVR4nO3dsU0DMRiG4c8HAswAA0AFCzAFdKzACqzACgwAFQswAB1QsQFQckIIruAO7PsnOe9TnU/nU2zLPtlOkiRJkiRJkiRJkiRJktTHCTADTzPgOLSRSMb8XZAZ8BHYTxTPeXJxXA16QewCbycWZAbchTUVxAi8c7ggM+A1qrEIduBrjYIsnotpLILvNRfkvdtyMSZgf42F2QFP8Y1Fc7fGwjzGtxXOEXBda0E2SJGnpx1wanGauwAe2PyevlqH7IZFuAxqJh2ZQvfbOqTu58D9x/qG7c3v5QS4xBYlaQvtD/w95Cc8B+4pI+hpWGfZnFNGhpIki7fXDngeHUQbjTIElgPIsAGZZUqXZHgZT8vLuAsV1/RYkMyyJcsyZZLNWiZLJMsyZZLNqpBlmTJZIlmWKZNsVoUsy5RJNqtClmXKJJtVIcsyZZLNqpBlmTLJZlXIskxZRVkmpUuWZVImy5JlmTLJZlXIskwdLFOy/CcvSZIkSZIkSZIkSZIkSZI0Ev86rM6/kOuw3OuwnOEay70Oa9FyBodjXHeUydNtfFuxVHkoyC0Ol5uiy0NBZsBVQD9RVHkoyGIDHq7GLTr8RJAkSZIkSZIkSZIkSZKkbzVEspDH5ImiAAAAAElFTkSuQmCC',
  },
  
  // Storage keys
  storage: {
    authToken: 'userToken',
    userProfile: 'userProfile',
    appSettings: 'appSettings',
  }
};
