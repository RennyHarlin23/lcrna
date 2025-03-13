"use client"

import { useState } from "react"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Search, Database, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import '../App.css' // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'

type NcRNA = {
  "Causal Description": string
  Causality: string
  Description: string
  "Disease Name": string
  DysfunctionPattern: string
  "PubMed ID": number
  Sample: string
  Species: string
  ValidatedMethod: string
  "ncRNA Category": string
  "ncRNA Symbol": string
  _id: string
}

export default function NcRNASearch() {
  const [symbol, setSymbol] = useState("")
  const [disease, setDisease] = useState("")
  const [data, setData] = useState<NcRNA[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const navigate = useNavigate()

  const fetchData = async () => {
    setIsLoading(true)
    setHasSearched(true)

    const symbolQuery = symbol.trim() ? symbol : "Nil"
    const diseaseQuery = disease.trim() ? disease : "Nil"

    try {
      const response = await fetch(`http://localhost:4000/lncrna/${symbolQuery}/disease/${diseaseQuery}`)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">ncRNA Database Search</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search for non-coding RNA by symbol or disease to explore their relationships and associated research.
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor="symbol">ncRNA Symbol</Label>
                <Input
                  type="text"
                  id="symbol"
                  placeholder="Enter ncRNA symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disease">Disease</Label>
                <Input
                  type="text"
                  id="disease"
                  placeholder="Enter disease name"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchData} className="w-full md:w-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Results
              {data.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {data.length} entries
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : data.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">ncRNA Symbol</TableHead>
                        <TableHead className="font-semibold">Disease Name</TableHead>
                        <TableHead className="font-semibold">ncRNA Category</TableHead>
                        <TableHead className="font-semibold">PubMed ID</TableHead>
                        <TableHead className="font-semibold">Species</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item, index) => (
                        <TableRow 
                          key={index} 
                          className="hover:bg-muted/50 cursor-pointer" 
                          onClick={() => navigate(`/details/${item._id}`)}
                        >
                          <TableCell className="font-medium">{item["ncRNA Symbol"]}</TableCell>
                          <TableCell>{item["Disease Name"]}</TableCell>
                          <TableCell>{item["ncRNA Category"]}</TableCell>
                          <TableCell>
                            <a
                              href={`https://pubmed.ncbi.nlm.nih.gov/${item["PubMed ID"]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {item["PubMed ID"]}
                            </a>
                          </TableCell>
                          <TableCell>{item.Species}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : hasSearched ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No results found. Try different search parameters.</p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Enter search parameters and click Search to find ncRNA data.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}