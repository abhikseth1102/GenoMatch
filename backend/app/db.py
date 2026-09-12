import json

MUTATIONS = [
    {
        "hgvs_notation": "HBB:c.20A>T",
        "common_name": "CD6 (Glu->Val)",
        "position": 20,
        "change": "A>T",
        "disorder": "Sickle Cell",
        "classification": "Pathogenic",
        "type": "SNP"
    },
    {
        "hgvs_notation": "HBB:c.92+5G>C",
        "common_name": "IVS I-5",
        "position": 92,
        "change": "G>C",
        "disorder": "beta+-thalassemia",
        "classification": "Pathogenic",
        "type": "SNP"
    },
    {
        "hgvs_notation": "HBB:c.126_129delCTTT",
        "common_name": "CD 41/42",
        "position": 126,
        "change": "CTTT",
        "disorder": "beta0-thalassemia",
        "classification": "Pathogenic",
        "type": "Deletion"
    }
]

def get_mutation_by_pos_change(position: int, change: str):
    for m in MUTATIONS:
        if m["position"] == position and m["change"] == change:
            return m
    return None

