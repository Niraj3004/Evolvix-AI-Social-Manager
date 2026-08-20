import multiprocessing

def foo():
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    import mlflow
    import mlflow.xgboost
    print('success')

if __name__ == '__main__':
    multiprocessing.set_start_method('spawn')
    p = multiprocessing.Process(target=foo)
    p.start()
    p.join()
