export default function handler(req, res) {
    const { color } = req.query;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.end(`<svg width="300" height="20" viewBox="0 0 300 20" xmlns="http://www.w3.org/2000/svg"><path fill="#${color}" d="M300 7.05426C291.016 4.70284 264 0 227.812 0C191.625 0 161.953 4.92178 150 7.05426C137.109 9.35401 103.828 13.9535 73.8281 13.9535C43.8281 13.9535 12.1094 9.35401 0 7.05426V20H300V7.05426Z"/></svg>`);
}