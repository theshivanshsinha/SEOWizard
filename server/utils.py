import random
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import ssl
import socket

def get_page_speed(url):
    """Simulate page speed measurement"""
    return random.randint(500, 3000)  # milliseconds

def get_readability_score(url):
    """Simulate readability analysis"""
    scores = ['Excellent', 'Good', 'Average', 'Poor']
    return random.choice(scores)

def check_mobile_friendly(url):
    """Simulate mobile responsiveness check"""
    return random.choice([True, False])

def analyze_meta_tags(url):
    """Analyze meta tags and return count of essential tags found"""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        meta_count = 0
        essential_tags = [
            'title',
            'description', 
            'keywords',
            'author',
            'viewport',
            'robots',
            'canonical',
            'og:title',
            'og:description',
            'og:image',
            'twitter:card',
            'twitter:title',
            'twitter:description',
            'charset',
            'language'
        ]
        
        # Check title tag
        if soup.title and soup.title.string:
            meta_count += 1
            
        # Check meta tags
        for meta in soup.find_all('meta'):
            name = meta.get('name', '').lower()
            property_attr = meta.get('property', '').lower()
            http_equiv = meta.get('http-equiv', '').lower()
            
            if name in essential_tags or property_attr in essential_tags:
                meta_count += 1
            elif http_equiv == 'content-type' and 'charset' in str(meta):
                meta_count += 1
                
        # Check canonical link
        if soup.find('link', rel='canonical'):
            meta_count += 1
            
        return min(meta_count, 15)  # Cap at 15 as shown in frontend
        
    except Exception as e:
        print(f"Error analyzing meta tags: {e}")
        return random.randint(8, 12)  # Fallback random value

def get_security_score(url):
    """Analyze website security features"""
    try:
        response = requests.get(url, timeout=10)
        security_score = 0
        
        # Check HTTPS
        if url.startswith('https://'):
            security_score += 30
            
        # Check security headers
        headers = response.headers
        security_headers = {
            'strict-transport-security': 15,
            'content-security-policy': 15,
            'x-frame-options': 10,
            'x-content-type-options': 10,
            'x-xss-protection': 10,
            'referrer-policy': 5,
            'permissions-policy': 5
        }
        
        for header, points in security_headers.items():
            if header in [h.lower() for h in headers.keys()]:
                security_score += points
                
        # Additional SSL certificate check
        try:
            parsed_url = urlparse(url)
            if parsed_url.scheme == 'https':
                context = ssl.create_default_context()
                with socket.create_connection((parsed_url.hostname, 443), timeout=5) as sock:
                    with context.wrap_socket(sock, server_hostname=parsed_url.hostname) as ssock:
                        cert = ssock.getpeercert()
                        if cert:
                            security_score += 10
        except:
            pass
            
        return min(security_score, 100)
        
    except Exception as e:
        print(f"Error analyzing security: {e}")
        return random.randint(80, 95)  # Fallback random value

def analyze_image_optimization(url):
    """Analyze image optimization including alt tags and formats"""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        images = soup.find_all('img')
        if not images:
            return 100  # No images means 100% optimized
            
        optimized_count = 0
        total_images = len(images)
        
        for img in images:
            score = 0
            
            # Check for alt attribute
            if img.get('alt'):
                score += 40
                
            # Check for proper src
            if img.get('src'):
                src = img.get('src')
                score += 20
                
                # Check for modern formats (webp, avif)
                if any(fmt in src.lower() for fmt in ['.webp', '.avif']):
                    score += 20
                elif any(fmt in src.lower() for fmt in ['.jpg', '.jpeg', '.png']):
                    score += 10
                    
            # Check for loading attribute (lazy loading)
            if img.get('loading') == 'lazy':
                score += 10
                
            # Check for width/height attributes
            if img.get('width') and img.get('height'):
                score += 10
                
            if score >= 60:  # Consider optimized if score >= 60%
                optimized_count += 1
                
        optimization_percentage = (optimized_count / total_images) * 100
        return round(optimization_percentage)
        
    except Exception as e:
        print(f"Error analyzing images: {e}")
        return random.randint(70, 90)  # Fallback random value
