import datetime
import math
import json

class PerformanceAnalyzer:
    """
    Sans Chaine Performance Engine
    Focuses on Durability, Aerobic Decoupling, and Training Stress.
    """
    
    def __init__(self, rider_weight_kg):
        self.rider_weight = rider_weight_kg
        self.ctl_constant = 42
        self.atl_constant = 7

    def calculate_aerobic_decoupling(self, power_data, hr_data):
        if len(power_data) != len(hr_data) or len(power_data) < 600:
            return None

        mid = len(power_data) // 2
        
        avg_p1 = sum(power_data[:mid]) / mid
        avg_hr1 = sum(hr_data[:mid]) / mid
        ef1 = avg_p1 / avg_hr1 if avg_hr1 > 0 else 0
        
        avg_p2 = sum(power_data[mid:]) / (len(power_data) - mid)
        avg_hr2 = sum(hr_data[mid:]) / (len(hr_data) - mid)
        ef2 = avg_p2 / avg_hr2 if avg_hr2 > 0 else 0
        
        if ef1 == 0: return 0
        
        decoupling = ((ef1 - ef2) / ef1) * 100
        return round(decoupling, 2)

    def calculate_durability(self, power_data):
        cumulative_work_joules = 0
        threshold_joules = 2000000  # 2000 kJ
        work_milestone_index = -1
        
        for i, watts in enumerate(power_data):
            cumulative_work_joules += watts
            if cumulative_work_joules >= threshold_joules and work_milestone_index == -1:
                work_milestone_index = i
                break
        
        if work_milestone_index == -1 or work_milestone_index >= len(power_data) - 300:
            return "Incomplete Data for 2000kJ test."

        def get_max_5min(data):
            if len(data) < 300: return 0
            max_p = 0
            for i in range(len(data) - 300):
                avg = sum(data[i:i+300]) / 300
                if avg > max_p: max_p = avg
            return max_p

        power_fresh = get_max_5min(power_data[:work_milestone_index])
        power_fatigued = get_max_5min(power_data[work_milestone_index:])
        decay = ((power_fresh - power_fatigued) / power_fresh * 100) if power_fresh > 0 else 0
        
        return {
            "fresh_wkg": round(power_fresh / self.rider_weight, 2),
            "fatigued_wkg": round(power_fatigued / self.rider_weight, 2),
            "decay": round(decay, 2),
            "status": "Resilient" if decay < 5 else "Fatigue Sensitive"
        }
