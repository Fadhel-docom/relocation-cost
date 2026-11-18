#!/usr/bin/env python3
"""Reproducible weighted extraction for 2021 VIUS box trucks.

Usage:
  python3 tools/b24-vius-box-truck-extract.py /path/to/vius_2021_puf_csv.zip

Uses only Python's standard library. It deliberately does not convert
categorical maintenance/repair bands into a point estimate or a $/mile rate.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import zipfile
from collections import defaultdict
from pathlib import Path

REQUIRED = {
    "BTYPE", "BUSRELATED", "GVWR_CLASS", "FUELTYPE", "MPG", "MILESANNL",
    "GM_COST", "ER_COST", "LOADEDPCT", "DEADHEADPCT", "REPOSITIONPCT",
    "TABWEIGHT", "RGROUP",
}
GVWR_LABELS = {
    "3": "10,001-14,000 lb",
    "4": "14,001-16,000 lb",
    "5": "16,001-19,500 lb",
    "6": "19,501-26,000 lb",
    "7": "26,001-33,000 lb",
    "8": "Over 33,000 lb",
}
FUEL_LABELS = {"10": "Gasoline", "20": "Diesel"}
METRICS = {
    "MPG": "mpg",
    "MILESANNL": "annual_miles",
    "LOADEDPCT": "loaded_pct",
    "DEADHEADPCT": "deadhead_pct",
    "REPOSITIONPCT": "reposition_pct",
}
COST_LABELS = {
    "GM_COST": {
        "1": "Less than $100", "2": "$100-$499", "3": "$500-$999",
        "4": "$1,000-$1,999", "5": "$2,000-$4,999",
        "6": "$5,000-$9,999", "7": "$10,000 or more", "8": "Not reported",
    },
    "ER_COST": {
        "1": "$501-$999", "2": "$1,000-$1,999", "3": "$2,000-$4,999",
        "4": "$5,000-$9,999", "5": "$10,000-$19,999",
        "6": "$20,000 or more", "7": "Not reported",
    },
}


def number(value):
    if value is None or str(value).strip() in {"", "X", "x", "None"}:
        return None
    try:
        result = float(value)
    except (TypeError, ValueError):
        return None
    return result if math.isfinite(result) else None


def read_rows(zip_path: Path):
    with zipfile.ZipFile(zip_path) as archive:
        csv_names = [n for n in archive.namelist() if n.lower().endswith(".csv")]
        if len(csv_names) != 1:
            raise ValueError(f"Expected exactly one CSV in ZIP; found {csv_names}")
        with archive.open(csv_names[0]) as raw:
            import io
            text = io.TextIOWrapper(raw, encoding="utf-8-sig", newline="")
            reader = csv.DictReader(text)
            missing = REQUIRED - set(reader.fieldnames or [])
            if missing:
                raise ValueError(f"Missing required columns: {sorted(missing)}")
            return list(reader)


def weighted_estimate(rows, field):
    valid = []
    for row in rows:
        x = number(row.get(field))
        w = number(row.get("TABWEIGHT"))
        rg = str(row.get("RGROUP", "")).strip()
        if x is not None and w is not None and w > 0 and rg:
            valid.append((x, w, rg))
    if not valid:
        return {"mean": None, "cv_pct": None, "valid_records": 0, "weight_sum": 0.0}

    weight_sum = sum(w for _, w, _ in valid)
    estimate = sum(x * w for x, w, _ in valid) / weight_sum

    # VIUS PUF User Guide: use random-group replicate ratios for a ratio mean.
    # Multiplying both numerator and denominator in each group by G cancels.
    groups = defaultdict(lambda: [0.0, 0.0])
    for x, w, rg in valid:
        groups[rg][0] += x * w
        groups[rg][1] += w
    replicates = [num / den for num, den in groups.values() if den > 0]
    g_count = len(replicates)
    if g_count > 1 and estimate != 0:
        variance = sum((rep - estimate) ** 2 for rep in replicates) / (g_count * (g_count - 1))
        cv = math.sqrt(variance) / abs(estimate) * 100
    else:
        cv = None
    return {
        "mean": estimate,
        "cv_pct": cv,
        "valid_records": len(valid),
        "weight_sum": weight_sum,
        "nonempty_random_groups": g_count,
    }


def weighted_cost_distribution(rows, field):
    # X = not applicable. Blank is missing. "Not reported" remains a visible category.
    valid = []
    for row in rows:
        code = str(row.get(field, "")).strip()
        w = number(row.get("TABWEIGHT"))
        if code in COST_LABELS[field] and w is not None and w > 0:
            valid.append((code, w))
    denominator = sum(w for _, w in valid)
    totals = defaultdict(lambda: {"records": 0, "weight": 0.0})
    for code, w in valid:
        totals[code]["records"] += 1
        totals[code]["weight"] += w
    return {
        "valid_records": len(valid),
        "valid_weight": denominator,
        "categories": [
            {
                "code": code,
                "label": COST_LABELS[field][code],
                "records": item["records"],
                "weighted_share_pct": item["weight"] / denominator * 100 if denominator else None,
            }
            for code, item in sorted(totals.items(), key=lambda pair: int(pair[0]))
        ],
    }


def rounded(value, digits=2):
    return round(value, digits) if value is not None else None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("zip_path", type=Path, help="2021 VIUS PUF CSV ZIP")
    parser.add_argument("--output", type=Path, help="Optional JSON output path")
    args = parser.parse_args()

    all_rows = read_rows(args.zip_path)
    box_rows = [r for r in all_rows if r["BTYPE"] == "07"]
    business_rows = [r for r in box_rows if r["BUSRELATED"] == "1"]
    result = {
        "source": "2021 VIUS Public Use File (BTS/Census), user-supplied CSV ZIP",
        "filters": {"BTYPE": "07 (Box truck)", "BUSRELATED": "1 (Some commercial activity)"},
        "counts": {
            "puf_records": len(all_rows),
            "all_box_truck_records": len(box_rows),
            "business_related_box_truck_records": len(business_rows),
            "business_related_weighted_vehicle_estimate": sum(number(r["TABWEIGHT"]) or 0 for r in business_rows),
        },
        "cells": [],
    }

    for gvwr in sorted(GVWR_LABELS, key=int):
        for fuel in ("10", "20"):
            cell = [r for r in business_rows if r["GVWR_CLASS"] == gvwr and r["FUELTYPE"] == fuel]
            if not cell:
                continue
            entry = {
                "gvwr_class": gvwr,
                "gvwr_label": GVWR_LABELS[gvwr],
                "fuel_code": fuel,
                "fuel": FUEL_LABELS[fuel],
                "puf_records": len(cell),
                "weighted_vehicle_estimate": sum(number(r["TABWEIGHT"]) or 0 for r in cell),
                "metrics": {},
            }
            for field, label in METRICS.items():
                stats = weighted_estimate(cell, field)
                entry["metrics"][label] = {
                    "weighted_mean": rounded(stats["mean"], 2 if field == "MPG" else 1),
                    "random_group_cv_pct": rounded(stats["cv_pct"], 1),
                    "valid_records": stats["valid_records"],
                    "valid_weight": rounded(stats["weight_sum"], 1),
                    "nonempty_random_groups": stats.get("nonempty_random_groups", 0),
                }
            result["cells"].append(entry)

    focus = [
        r for r in business_rows
        if r["GVWR_CLASS"] in {"6", "7"} and r["FUELTYPE"] == "20"
    ]
    result["focus_cell"] = {
        "definition": "Business-related diesel box trucks, GVWR classes 6 and 7 (19,501-33,000 lb)",
        "puf_records": len(focus),
        "weighted_vehicle_estimate": sum(number(r["TABWEIGHT"]) or 0 for r in focus),
        "metrics": {},
        "maintenance_repair_bands": {},
    }
    for field, label in METRICS.items():
        stats = weighted_estimate(focus, field)
        result["focus_cell"]["metrics"][label] = {
            "weighted_mean": rounded(stats["mean"], 2 if field == "MPG" else 1),
            "random_group_cv_pct": rounded(stats["cv_pct"], 1),
            "valid_records": stats["valid_records"],
            "valid_weight": rounded(stats["weight_sum"], 1),
            "nonempty_random_groups": stats.get("nonempty_random_groups", 0),
        }
    for field in ("GM_COST", "ER_COST"):
        result["focus_cell"]["maintenance_repair_bands"][field] = weighted_cost_distribution(focus, field)

    serialized = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        args.output.write_text(serialized + "\n", encoding="utf-8")
    print(serialized)


if __name__ == "__main__":
    main()
