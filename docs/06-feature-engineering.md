# Feature Engineering Checklist

## Text Features (Module A + B)

| Feature | Extraction |
|---------|------------|
| Combined text blob | Concatenate all text fields |
| Text length | Character & word count |
| Salary mentioned | Regex `\$|USD|salary|per hour|lpa` |
| Vague requirements | Short requirements + long description mismatch |
| Urgency language | `urgent`, `immediate`, `limited`, `act now`, `quick money` |
| Work-from-home bait | `work from home`, `no experience`, `easy money` |
| ALL CAPS ratio | Uppercase / total chars |
| Exclamation density | `!` count per 100 words |
| Metadata | `telecommuting`, `has_company_logo`, `has_questions` |

## Cybersecurity Features (Module C)

| Feature | Type | Rule / Source |
|---------|------|---------------|
| `uses_personal_email` | binary | Free provider list |
| `email_domain_mismatch` | binary | email domain ≠ company token |
| `domain_age_days` | numeric | Simulated / WHOIS API |
| `suspicious_url` | binary | Shorteners, .tk, raw IP |
| `requests_sensitive_data` | binary | Keyword regex |
| `phishing_urgency_score` | numeric | Keyword count normalized |
| `careers_page_match` | binary | Simulated / crawler |
| `no_company_logo` | binary | From dataset field |
| `vague_company_profile` | binary | profile length < 50 chars |

## TF-IDF Configuration

```python
TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 2),
    min_df=2,
    stop_words="english",
    sublinear_tf=True,
)
```

## Sensitive-Data Keywords

`pan`, `aadhaar`, `aadhar`, `bank account`, `routing number`, `ssn`, `social security`, `password`, `otp`, `credit card`, `processing fee`, `registration fee`, `equipment fee`, `wire transfer`

## Phishing Urgency Keywords

`urgent`, `immediately`, `act now`, `limited slots`, `only few positions`, `guaranteed`, `no interview`, `instant hire`, `send details now`
