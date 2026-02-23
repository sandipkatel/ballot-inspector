# Ballot Inspector ( मतपत्र परीक्षक )

### Overview

<p style="text-align: justify;"> Ballot Inspector is a <a link="https://papersplea.se/" href="_blank">Papers Please</a> -inspired browser game set inside the Election Commission of Nepal. Your job: examine each Proportional Representation ballot that comes across your desk and decide in real time, whether it is <strong>valid</strong> or <strong>invalid</strong> before the clock runs out. </p>

<br/>

<div align="center" style="flex-direction: column;">
  <img src="./public/demo.gif" alt="App Demo" width="100%"/>
  <div style="font-size: 0.8em; color: gray;">Game Screen</div>
</div>

<br/>

<p style="text-align: justify;"> Every ballot presents a new voter and a new challenge. Some are clean and straightforward. Others hide torn corners, ambiguous border marks, missing signatures, or identifying handwriting designed to trip you up. Wrong calls cost you time, too many mistakes and your shift ends early. The integrity of the election depends on your accuracy. </p>

<br/>

### Invalid Ballot Types

| Type                  | Description                                   |
| --------------------- | --------------------------------------------- |
| **Multiple Marks**    | Two or more party symbols are marked          |
| **Blank Ballot**      | No mark made anywhere on the ballot           |
| **Border Mark**       | Mark straddles the line between two cells     |
| **Identifying Marks** | Voter's name, initials, or writing is present |
| **No Signature**      | Election officer's signature is missing       |
| **Torn / Damaged**    | Physical damage makes voter intent unclear    |

<br/>

### Prerequisites

- Node.js (v18 or higher)
- npm

<br/>

### Installation

```bash
# Clone the repository
git clone https://github.com/crypticsy/ballot.git

# Navigate to project directory
cd ballot

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

<br/>

### Build for Production

```bash
npm run build
```
