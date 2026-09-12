from .db import get_mutation_by_pos_change

def parse_fasta(fasta_str: str) -> str:
    lines = fasta_str.strip().split("\n")
    seq = ""
    for line in lines:
        if not line.startswith(">"):
            seq += line.strip()
    return seq

def needleman_wunsch(seq1: str, seq2: str, match_score: int = 1, mismatch_score: int = -1, gap_penalty: int = -1):
    n = len(seq1)
    m = len(seq2)
    
    score = [[0 for _ in range(m + 1)] for _ in range(n + 1)]
    
    for i in range(n + 1):
        score[i][0] = gap_penalty * i
    for j in range(m + 1):
        score[0][j] = gap_penalty * j
        
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            match = score[i - 1][j - 1] + (match_score if seq1[i - 1] == seq2[j - 1] else mismatch_score)
            delete = score[i - 1][j] + gap_penalty
            insert = score[i][j - 1] + gap_penalty
            score[i][j] = max(match, delete, insert)
            
    align1 = ""
    align2 = ""
    i = n
    j = m
    
    while i > 0 and j > 0:
        score_current = score[i][j]
        score_diagonal = score[i-1][j-1]
        score_up = score[i][j-1]
        score_left = score[i-1][j]
        
        if score_current == score_diagonal + (match_score if seq1[i-1] == seq2[j-1] else mismatch_score):
            align1 += seq1[i-1]
            align2 += seq2[j-1]
            i -= 1
            j -= 1
        elif score_current == score_left + gap_penalty:
            align1 += seq1[i-1]
            align2 += "-"
            i -= 1
        elif score_current == score_up + gap_penalty:
            align1 += "-"
            align2 += seq2[j-1]
            j -= 1
            
    while i > 0:
        align1 += seq1[i-1]
        align2 += "-"
        i -= 1
    while j > 0:
        align1 += "-"
        align2 += seq2[j-1]
        j -= 1
        
    return align1[::-1], align2[::-1]

def align_and_extract(uploaded_seq: str, ref_seq: str):
    aligned_ref, aligned_up = needleman_wunsch(ref_seq, uploaded_seq)
    
    variants = []
    alignment_viz = []
    
    ref_pos = 1
    for i in range(len(aligned_ref)):
        rb = aligned_ref[i]
        ub = aligned_up[i]
        
        alignment_viz.append({"pos": i, "ref": rb, "up": ub})
        
        if rb != "-" and ub != "-" and rb != ub:
            variants.append({
                "position": ref_pos,
                "reference_base": rb,
                "alternate_base": ub,
                "type": "SNP"
            })
            ref_pos += 1
        elif rb == "-":
            variants.append({
                "position": ref_pos,
                "reference_base": "-",
                "alternate_base": ub,
                "type": "Insertion"
            })
        elif ub == "-":
            variants.append({
                "position": ref_pos,
                "reference_base": rb,
                "alternate_base": "-",
                "type": "Deletion"
            })
            ref_pos += 1
        else:
            ref_pos += 1
            
    classified_variants = []
    has_pathogenic = False
    for v in variants:
        if v["type"] == "SNP":
            change = f"{v['reference_base']}>{v['alternate_base']}"
        else:
            change = v["alternate_base"] if v["type"] == "Insertion" else v["reference_base"]
            
        match = get_mutation_by_pos_change(v["position"], change)
        if match:
            v["hgvs"] = match["hgvs_notation"]
            v["classification"] = match["classification"]
            v["mutation_name"] = match["common_name"]
            has_pathogenic = True
        else:
            v["hgvs"] = "VUS"
            v["classification"] = "VUS"
            v["mutation_name"] = "Unknown"
        classified_variants.append(v)
        
    status = "Normal"
    if has_pathogenic:
        status = "Carrier"
        
    genotype = {
        "status": status,
        "description": "Variant detected" if has_pathogenic else "No known pathogenic variants detected",
        "mutation_name": classified_variants[0]["mutation_name"] if has_pathogenic else None,
        "classification": classified_variants[0]["classification"] if has_pathogenic else None
    }
            
    return alignment_viz, classified_variants, genotype
