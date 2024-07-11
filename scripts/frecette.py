import tkinter as tk
from tkinter import messagebox
import sys
import win32com.client as wincom
import pygame
import threading

speak = wincom.Dispatch("SAPI.SpVoice")

def segnala(nome):
	speak.Speak("Prossima freccetta a " + nome)

class DartScoringApp:
	def __init__(self, root, nome_giocatore1, nome_giocatore2, punteggio_ini):
		self.root = root
		self.root.title("Punteggio Freccette")

		self.punteggio_totale_giocatore1 = punteggio_ini
		self.punteggio_totale_giocatore2 = punteggio_ini
		self.numero_giocata = 1
		self.turno_giocatore1 = True

		self.nome_giocatore1 = nome_giocatore1
		self.nome_giocatore2 = nome_giocatore2

		font_large = ("Helvetica", 50)

		self.label_turno = tk.Label(root, text=f"Turno di {self.nome_giocatore1}", font=font_large)
		self.label_turno.pack(pady=10)

		self.label_giocata = tk.Label(root, text=f"Giocata {self.numero_giocata}", font=font_large)
		self.label_giocata.pack(pady=10)

		self.entry_punteggio = tk.Entry(root, font=font_large)
		self.entry_punteggio.pack(pady=10)

		self.button_inserisci = tk.Button(root, text="Inserisci", font=font_large, command=self.inserisci_punteggio)
		self.button_inserisci.pack(pady=10)

		self.label_totale_giocatore1 = tk.Label(root, text=f"Punteggio Totale {self.nome_giocatore1}: {self.punteggio_totale_giocatore1}", font=font_large)
		self.label_totale_giocatore1.pack(pady=10)

		self.label_totale_giocatore2 = tk.Label(root, text=f"Punteggio Totale {self.nome_giocatore2}: {self.punteggio_totale_giocatore2}", font=font_large)
		self.label_totale_giocatore2.pack(pady=10)

		self.button_fine = tk.Button(root, text="Fine", font=font_large, command=self.fine_partita)
		self.button_fine.pack(pady=10)

	def inserisci_punteggio(self):
		
		try:
			punteggio = int(self.entry_punteggio.get())
			if punteggio < 0:
				messagebox.showerror("Errore", "Il punteggio non può essere negativo.")
				return
			if self.turno_giocatore1:
				nuovo_punteggio = self.punteggio_totale_giocatore1 - punteggio
				if nuovo_punteggio < 0:
					nuovo_punteggio = self.punteggio_totale_giocatore1
				self.punteggio_totale_giocatore1 = nuovo_punteggio
				self.label_totale_giocatore1.config(text=f"Punteggio Totale {self.nome_giocatore1}: {self.punteggio_totale_giocatore1}")
				self.label_turno.config(text=f"Turno di {self.nome_giocatore2}")
				thread = threading.Thread(target=segnala, args=(nome_giocatore2))
				thread.start()
				thread.join()
			else:
				nuovo_punteggio = self.punteggio_totale_giocatore2 - punteggio
				if nuovo_punteggio < 0:
					nuovo_punteggio = self.punteggio_totale_giocatore2
				self.punteggio_totale_giocatore2 = nuovo_punteggio
				self.label_totale_giocatore2.config(text=f"Punteggio Totale {self.nome_giocatore2}: {self.punteggio_totale_giocatore2}")
				self.label_turno.config(text=f"Turno di {self.nome_giocatore1}")
				thread = threading.Thread(target=segnala, args=(nome_giocatore1))
				thread.start()
				thread.join()
				self.numero_giocata += 1
				self.label_giocata.config(text=f"Giocata {self.numero_giocata}")

			self.turno_giocatore1 = not self.turno_giocatore1
			self.entry_punteggio.delete(0, tk.END)

			if self.punteggio_totale_giocatore1 == 0:
				messagebox.showinfo("Gioco finito", f"{self.nome_giocatore1} ha vinto!")
				self.fine_partita()
			elif self.punteggio_totale_giocatore2 == 0:
				messagebox.showinfo("Gioco finito", f"{self.nome_giocatore2} ha vinto!")
				self.fine_partita()

		except ValueError:
			messagebox.showerror("Errore", "Inserisci un valore numerico valido.")

	def fine_partita(self):
		pygame.mixer.music.unload()
		pygame.mixer.music.load('./win.mp3')
		pygame.mixer.music.play(1)
		pygame.mixer.music.set_volume(0.2)
		pygame.mixer.music.unload()
		self.root.quit()

if __name__ == "__main__":
	if len(sys.argv) != 4:
		print("Uso: python freccette_gui_due_giocatori.py <Nome Giocatore 1> <Nome Giocatore 2> <punteggio>")
		sys.exit(1)
	pygame.mixer.init()
	pygame.mixer.music.load('./win.mp3')
	pygame.mixer.music.play(1)
	pygame.mixer.music.set_volume(0.2)

	nome_giocatore1 = sys.argv[1]
	nome_giocatore2 = sys.argv[2]
	
	pygame.mixer.music.load('./music.mp3')
	pygame.mixer.music.play(1)
	pygame.mixer.music.set_volume(0.2)
	root = tk.Tk()
	app = DartScoringApp(root, nome_giocatore1, nome_giocatore2, int(sys.argv[3]))
	root.mainloop()
