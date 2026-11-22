"""Read-only checks for the current public site; archived /v3 source is excluded."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [p for p in ROOT.rglob("*.html") if "v3" not in p.relative_to(ROOT).parts]


class ServiceCoverage(unittest.TestCase):
    def test_current_pages_do_not_advertise_california(self):
        self.assertTrue(PAGES)
        for path in PAGES:
            with self.subTest(page=str(path.relative_to(ROOT))):
                text = path.read_text()
                self.assertNotRegex(text, r"(?i)Northern California|NorCal|N\. California")
                self.assertNotRegex(text, r'(?:value|data-state)=[\"\x27]CA[\"\x27]')

    def test_structured_data_is_valid_and_coverage_is_supported(self):
        count = 0
        for path in PAGES:
            for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', path.read_text(), re.S):
                data = json.loads(raw)
                if "areaServed" in data:
                    count += 1
                    self.assertEqual([a["name"] for a in data["areaServed"]], ["Washington", "Oregon", "Idaho"])
        self.assertGreater(count, 0)

    def test_request_options_and_client_validation_match(self):
        home = (ROOT / "index.html").read_text()
        state = re.search(r'<select id="st".*?</select>', home, re.S).group()
        self.assertEqual(re.findall(r'<option value="([^"]+)"', state), ["WA", "OR", "ID"])
        script = (ROOT / "assets/js/site.js").read_text()
        self.assertIn("['WA','OR','ID'].includes(p.region)", script)
        self.assertIn("['WA','OR','ID'].includes(text(data,'state'))", script)

    def test_maps_and_privacy_rights_are_preserved(self):
        for file in ["index.html", "about-ivo/index.html"]:
            text = (ROOT / file).read_text()
            self.assertEqual(re.findall(r'data-state="([^"]+)"', text), ["WA", "OR", "ID"])
            self.assertIn('viewBox="0 0 548 410"', text)
        self.assertIn("for example California", (ROOT / "privacy/index.html").read_text())


if __name__ == "__main__":
    unittest.main()
