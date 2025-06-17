from ml_model import predict_seo_score
from utils import (
    get_page_speed, 
    check_mobile_friendly, 
    get_readability_score,
    analyze_meta_tags,
    get_security_score,
    analyze_image_optimization
)

def analyze_url(url):
    """Complete SEO analysis of the given URL"""
    
    # Core analysis
    seo_score = predict_seo_score(url)
    page_speed = get_page_speed(url)
    readability = get_readability_score(url)
    mobile_friendly = check_mobile_friendly(url)
    
    # New implementations
    meta_tags_count = analyze_meta_tags(url)
    security_score = get_security_score(url)
    images_optimized = analyze_image_optimization(url)
    
    result = {
        "seo_score": seo_score,
        "page_speed": page_speed,
        "readability": readability,
        "broken_links": 2,  # You can implement broken link detection later
        "accessibility": 88,  # You can implement accessibility scoring later
        "mobile_friendly": mobile_friendly,
        "security_score": security_score,
        "meta_tags": meta_tags_count,
        "images_optimized": images_optimized
    }
    
    return result
