from flask import Flask, request, jsonify
from flask_cors import CORS
from .bio import parse_fasta, align_and_extract
from .risk import calculate_couple_risk
from .db import MUTATIONS
import os

app = Flask(__name__)
CORS(app)

REF_SEQ_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "hbb_reference.fasta")
with open(REF_SEQ_PATH, "r") as f:
    REF_SEQ = parse_fasta(f.read())

@app.route("/api/analyze", methods=["POST"])
def analyze_sequence():
    try:
        data = request.json
        sequence = data.get("sequence", "")
        uploaded_seq = parse_fasta(sequence)
        
        if not uploaded_seq:
            return jsonify({"detail": "Invalid FASTA sequence provided."}), 400
            
        valid_chars = set("ATCGN")
        if not all(c.upper() in valid_chars for c in uploaded_seq):
            return jsonify({"detail": "Sequence contains invalid characters. Only A, T, C, G, N are allowed."}), 400
            
        alignment_viz, classified_variants, genotype_dict = align_and_extract(uploaded_seq.upper(), REF_SEQ)
        
        return jsonify({
            "alignment": alignment_viz,
            "variants": classified_variants,
            "genotype": genotype_dict
        })
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route("/api/couple-risk", methods=["POST"])
def couple_risk():
    try:
        data = request.json
        partnerA = data.get("partnerA", {})
        partnerB = data.get("partnerB", {})
        
        risk_dict, explanation = calculate_couple_risk(
            partnerA.get("status"),
            partnerB.get("status"),
            partnerA.get("mutation_name"),
            partnerB.get("mutation_name")
        )
        return jsonify({
            "riskBreakdown": risk_dict,
            "explanation": explanation
        })
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route("/api/mutations", methods=["GET"])
def get_mutations():
    return jsonify(MUTATIONS)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
