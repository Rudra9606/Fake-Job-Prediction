import os
import subprocess
import time

def run_cmd(args):
    print(f"Running: {' '.join(args)}")
    res = subprocess.run(args, capture_output=True, text=True)
    return res

def main():
    notebooks = [
        "01_EDA.ipynb",
        "02_Preprocessing.ipynb",
        "03_Feature_Engineering.ipynb",
        "04_ML_Models.ipynb",
        "05_XGBoost_Model.ipynb",
        "06_DL_Models.ipynb",
        "07_BERT_Model.ipynb",
        "08_Cybersecurity_Features.ipynb",
        "09_SHAP_Explainability.ipynb",
        "10_Hybrid_Model.ipynb"
    ]
    
    start_time = time.time()
    for nb in notebooks:
        path = os.path.join("notebooks", nb)
        print(f"\\n--- Executing {nb} ---")
        t0 = time.time()
        
        # Run nbconvert execute command
        res = run_cmd([
            "python", "-m", "jupyter", "nbconvert",
            "--to", "notebook",
            "--execute",
            "--inplace",
            path
        ])
        
        t1 = time.time()
        if res.returncode != 0:
            print(f"FAIL: {nb} failed to execute in {t1 - t0:.2f}s")
            print("Error Details:")
            print(res.stderr)
            # Stop execution on failure to debug
            return
        else:
            print(f"SUCCESS: {nb} executed successfully in {t1 - t0:.2f}s")
            
    total_time = time.time() - start_time
    print(f"\\nAll notebooks executed successfully in {total_time:.2f}s!")

if __name__ == "__main__":
    main()
