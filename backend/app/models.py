from pydantic import BaseModel
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    sequence: str
    format: str = "fasta"

class Variant(BaseModel):
    position: int
    reference_base: str
    alternate_base: str
    type: str
    hgvs: Optional[str] = None

class GenotypeResult(BaseModel):
    status: str
    description: str
    mutation_name: Optional[str] = None
    classification: Optional[str] = None

class AnalyzeResponse(BaseModel):
    alignment: List[dict]
    variants: List[Variant]
    genotype: GenotypeResult

class PartnerGenotype(BaseModel):
    status: str
    mutation_name: Optional[str] = None

class CoupleRiskRequest(BaseModel):
    partnerA: PartnerGenotype
    partnerB: PartnerGenotype

class RiskBreakdown(BaseModel):
    affected: float
    carrier: float
    normal: float

class CoupleRiskResponse(BaseModel):
    riskBreakdown: RiskBreakdown
    explanation: str
