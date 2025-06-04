import os

def main():
    # Root path (should point to project root)
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    vite_config = os.path.join(root_dir, 'vite.config.js')
    if os.path.isfile(vite_config):
        print("vite.config.js exists in project root: Vite detected.")
    else:
        print("vite.config.js NOT found in project root: Vite NOT detected (likely Create React App).")

if __name__ == "__main__":
    main()
