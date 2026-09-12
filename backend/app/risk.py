def calculate_couple_risk(partnerA_status: str, partnerB_status: str, partnerA_mutation: str = None, partnerB_mutation: str = None):
    # Both Normal -> 0% risk
    if partnerA_status == "Normal" and partnerB_status == "Normal":
        return {"affected": 0.0, "carrier": 0.0, "normal": 100.0}, "Both partners have normal genotypes. There is virtually no risk of having a child with these hemoglobinopathies."
        
    # One Normal, one Carrier -> 50% carrier, 50% normal
    if (partnerA_status == "Normal" and partnerB_status == "Carrier") or (partnerA_status == "Carrier" and partnerB_status == "Normal"):
        return {"affected": 0.0, "carrier": 50.0, "normal": 50.0}, "One partner is a carrier and the other is normal. Each pregnancy has a 50% chance of the child being a healthy carrier, and a 50% chance of being completely normal. There is no risk of the child having the disease."
        
    # Both Carrier (Same or different mutation) -> 25% affected, 50% carrier, 25% normal
    if partnerA_status == "Carrier" and partnerB_status == "Carrier":
        if partnerA_mutation == partnerB_mutation:
            expl = f"Both partners are carriers of the same mutation ({partnerA_mutation}). This follows a classic Mendelian recessive inheritance: each pregnancy has a 25% chance of the child being affected with the disease, a 50% chance of being a healthy carrier, and a 25% chance of being completely normal."
        else:
            expl = f"The partners are carriers of different mutations ({partnerA_mutation} and {partnerB_mutation}). This creates a risk for 'compound heterozygosity'. Each pregnancy has a 25% chance of the child inheriting both mutations and being affected by a compound disease, a 50% chance of being a carrier of one of the mutations, and a 25% chance of being completely normal."
        return {"affected": 25.0, "carrier": 50.0, "normal": 25.0}, expl
        
    # If any partner has the disease (for completeness, though MVP focuses on carriers)
    if partnerA_status == "Disease" and partnerB_status == "Normal":
        return {"affected": 0.0, "carrier": 100.0, "normal": 0.0}, "One partner is affected by the disease and the other is normal. All children will be healthy carriers."
        
    if partnerA_status == "Disease" and partnerB_status == "Carrier":
        return {"affected": 50.0, "carrier": 50.0, "normal": 0.0}, "One partner has the disease and the other is a carrier. Each pregnancy has a 50% chance of the child having the disease, and a 50% chance of being a carrier."
        
    if partnerA_status == "Disease" and partnerB_status == "Disease":
        return {"affected": 100.0, "carrier": 0.0, "normal": 0.0}, "Both partners have the disease. All children will have the disease."
        
    return {"affected": 0.0, "carrier": 0.0, "normal": 0.0}, "Unable to determine risk."
