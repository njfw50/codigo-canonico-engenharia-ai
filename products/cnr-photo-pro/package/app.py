"""Optional desktop interface. CLI remains available without Tk."""
import threading
import queue
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from pathlib import Path
from PIL import Image, ImageTk, ImageOps
from cnr import process


def main():
    win=tk.Tk(); win.title('CNR Photo Pro • 1.2.0 RC'); win.geometry('840x610'); win.configure(bg='#102034')
    style=ttk.Style(); style.theme_use('clam'); style.configure('TFrame',background='#102034'); style.configure('TLabel',background='#102034',foreground='#f0f4ff'); style.configure('TButton',padding=8)
    frame=ttk.Frame(win,padding=18); frame.pack(fill='both',expand=True)
    ttk.Label(frame,text='CNR PHOTO PRO',font=('TkDefaultFont',22,'bold')).pack(anchor='w')
    ttk.Label(frame,text='Enhance reality. Preserve identity.  •  Soli Deo Gloria  •  Evaluation candidate').pack(anchor='w',pady=(0,16))
    path=tk.StringVar(); status=tk.StringVar(value='Escolha uma fotografia RGB JPEG/PNG de até 4 MP.')
    bar=ttk.Frame(frame);bar.pack(fill='x'); ttk.Entry(bar,textvariable=path).pack(side='left',fill='x',expand=True)
    previews=ttk.Frame(frame);previews.pack(fill='both',expand=True,pady=14)
    left=ttk.Label(previews,text='Original',anchor='center');right=ttk.Label(previews,text='Resultado',anchor='center');left.pack(side='left',fill='both',expand=True);right.pack(side='left',fill='both',expand=True)
    def preview(label,p):
        with Image.open(p) as im:
            if im.width*im.height>4_000_000: raise ValueError('Imagem acima de 4 MP.')
            im=ImageOps.exif_transpose(im).convert('RGB');im.thumbnail((380,390)); pic=ImageTk.PhotoImage(im)
        label.configure(image=pic,text='');label.image=pic
    def choose():
        p=filedialog.askopenfilename(filetypes=[('Fotografias','*.jpg *.jpeg *.png')]);
        if p:
            path.set(p);right.configure(image='',text='Resultado');right.image=None
            try: preview(left,p)
            except Exception as e: status.set(str(e))
    pick=ttk.Button(bar,text='Abrir foto',command=choose);pick.pack(side='left',padx=6)
    messages=queue.Queue()
    def start():
        if not path.get(): return
        src=path.get(); dst=filedialog.asksaveasfilename(defaultextension='.png',initialfile=Path(src).stem+'-CNR.png',filetypes=[('PNG','*.png')]);
        if not dst:return
        go.state(['disabled']);pick.state(['disabled']);status.set('Processando localmente...')
        def worker():
            try: messages.put((process(src,dst),None))
            except Exception as e:messages.put((None,str(e)))
        threading.Thread(target=worker,daemon=True).start();win.after(150,poll)
    def poll():
        try:r,err=messages.get_nowait()
        except queue.Empty:win.after(150,poll);return
        go.state(['!disabled']);pick.state(['!disabled'])
        if err:status.set(err);return
        if r['status']=='review_required':
            status.set('PNG salvo — revise visualmente antes de usar.');preview(right,r['output'])
        else:status.set('Nenhum candidato passou pelas proteções. Original intacto.')
    go=ttk.Button(frame,text='Aprimorar e salvar PNG',command=start);go.pack(anchor='e')
    ttk.Label(frame,textvariable=status,wraplength=780).pack(anchor='w',pady=12)
    win.mainloop()
if __name__=='__main__':main()
