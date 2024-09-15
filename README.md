<h1 align="center">Welcome to transcript-api 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ngocsangyem/transcript-api/readme.md" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/ngocsangyem" target="_blank">
    <img alt="Twitter: ngocsangyem" src="https://img.shields.io/twitter/follow/ngocsangyem.svg?style=social" />
  </a>
</p>

> Youtube transcript API based on youtube-transcript

### 🏠 [Homepage](https://github.com/ngocsangyem/transcript-api)

### ✨ [Demo](https://github.com/ngocsangyem/transcript-api)

## Usage

### API Endpoints

#### 1. Get Transcript
**Endpoint**: GET `/api/transcript/:videoId`
Fetches the transcript for a given YouTube video ID.

**Query Parameters**:
- `_fields` (optional): Comma-separated list of fields to include in the response. If not provided, all fields are returned.

**Response**:

- 200 OK: Returns an array of transcript segments.

```javascript
 [
    {
      start_ms: Number,
      end_ms: Number,
      text: String
    },
    // ...
  ]
```

```javascript
// With specific fields
// Ex: /api/transcript/49QoFOkrafY?_fields=text,start_ms
 [
    {
      start_ms: Number,
      text: String
    },
    // ...
  ]
```

- 500 Internal Server Error: If there's an error fetching the transcript.

#### 2. Validate Video ID

**Endpoint**: GET `/api/transcript/validate/:videoId`
Validates if a given YouTube video ID is valid.
**Response**:
- 200 OK: { isValid: true } if the video ID is valid.
- 400 Bad Request: { isValid: false } if the video ID is invalid.
- 500 Internal Server Error: If there's an error validating the video ID.

## Install

```sh
npm install
```

## Run dev

```sh
npm start
```

## Todo

- Use Typescript

## Author

👤 **ngocsangyem**

* Website: https://www.ngocsangyem.dev/
* Twitter: [@ngocsangyem](https://twitter.com/ngocsangyem)
* Github: [@ngocsangyem](https://github.com/ngocsangyem)
* LinkedIn: [@ngocsangyem](https://linkedin.com/in/ngocsangyem)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/ngocsangyem/transcript-api/issues). 

## Show your support

Give a ⭐️ if this project helped you!