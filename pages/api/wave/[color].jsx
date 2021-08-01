export default function handler(req, res) {
    const { color } = req.query;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.end(`<svg width="268" height="20" viewBox="0 0 268 20" xmlns="http://www.w3.org/2000/svg"><path fill="#${color}" d="M0 7.05426C8.02604 4.70284 32.16 0 64.4875 0C96.815 0 123.322 4.92178 134 7.05426C145.516 9.35401 175.247 13.9535 202.047 13.9535C228.847 13.9535 257.182 9.35401 268 7.05426V20H0V7.05426Z"/></svg>`);
}