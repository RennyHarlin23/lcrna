"use client"

import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Loader2, ExternalLink, Database, FileText, Dna } from "lucide-react"
import ForceGraph2D from "react-force-graph-2d"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"

type NcRNA = {
  "Causal Description": string
  Causality: string
  Description: string
  "Disease Name": string
  "Dysfunction Pattern": string
  "PubMed ID": number
  Sample: string
  Species: string
  "Validated Method": string
  "ncRNA Category": string
  "ncRNA Symbol": string
  _id: string
}

export default function NcRNADetails() {
  const { id } = useParams() // Using React Router's useParams instead of Next.js router
  const [data, setData] = useState<NcRNA | null>(null)
  const [diseases, setDiseases] = useState<string[]>([
    "Osteosarcoma",
    "Glioma",
    "Retinoblastoma",
    "stomach carcinoma",
    "Nasopharyngeal Neoplasms",
    "Arthritis, Rheumatoid",
    "Mouth Neoplasms",
    "Squamous Cell Carcinoma of Head and Neck",
    "Lung Diseases",
    "Leukemia, Myeloid, Acute",
    "Breast Neoplasms",
    "Colorectal Neoplasms",
    "Thyroid Cancer, Papillary",
    "Carcinoma, Renal Cell",
    "Ovarian Neoplasms",
    "Carcinoma, Non-Small-Cell Lung",
    "Prostatic Neoplasms",
    "Leukemia",
    "Carcinoma, Ductal, Breast",
  ])
  const [isLoading, setIsLoading] = useState(true)
  const graphRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 })

  // Function to fetch diseases (placeholder since it's not implemented in the original)
  const fetchDiseases = (ncRNASymbol: string) => {
    // This function was called but not implemented in the original code
    // Keeping it as a placeholder to maintain functionality
    console.log(`Fetching diseases for ${ncRNASymbol}`)
  }

  // Fix the dependency array to avoid infinite loop
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/lcrna/details/${id}`)
        const result = await response.json()
        console.log(result)
        if (result && result.length > 0) {
          console.log(result[0]["ncRNA Symbol"])
          setData(result[0])
          fetchDiseases(result[0]["ncRNA Symbol"])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Get container dimensions for responsive graph
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 400,
        })
      }
    }

    // Initial dimensions
    updateDimensions()

    // Update on resize
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Prepare graph data - remove duplicate diseases
  const getGraphData = () => {
    if (!data || !diseases.length) return { nodes: [], links: [] }

    // Remove duplicate diseases
    const uniqueDiseases = [...new Set(diseases)]

    // Create center node for ncRNA
    const nodes = [
      {
        id: data["ncRNA Symbol"] || "Unknown ncRNA",
        name: data["ncRNA Symbol"] || "Unknown ncRNA",
        group: "ncRNA",
        val: 20,
      },
    ]

    // Add disease nodes
    uniqueDiseases.forEach((disease) => {
      nodes.push({ id: disease, name: disease, group: "disease", val: 10 })
    })

    // Create links from ncRNA to each disease
    const links = uniqueDiseases.map((disease) => ({
      source: data["ncRNA Symbol"] || "Unknown ncRNA",
      target: disease,
    }))

    return { nodes, links }
  }

  // Configure graph physics when component mounts
  useEffect(() => {
    if (!graphRef.current) return

    // Initialize forces
    graphRef.current.d3Force("charge").strength(-120)
    graphRef.current.d3Force("link").distance(100)
    graphRef.current.d3Force("center").strength(0.05)

    // Zoom to fit after initial render
    setTimeout(() => {
      graphRef.current?.zoomToFit(400, 20)
    }, 500)
  }, [graphRef.current, diseases])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading ncRNA data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">No Data Found</CardTitle>
            <CardDescription className="text-center">
              We couldn't find any ncRNA data for the provided ID.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Database className="h-16 w-16 text-muted-foreground opacity-50" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const graphData = getGraphData()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Card className="shadow-md border-t-4 border-t-primary">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-2">
              <Dna className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">{data["ncRNA Symbol"]}</CardTitle>
            </div>
            <CardDescription>
              <Badge variant="outline" className="mr-2">
                {data["ncRNA Category"]}
              </Badge>
              <Badge variant="secondary">{data.Species}</Badge>
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="network">Diseases Associated</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-start gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Basic Information
                      </h3>
                      <Separator className="mb-4" />

                      <div className="grid grid-cols-[120px_1fr] gap-y-2">
                        <span className="font-medium text-muted-foreground">Disease:</span>
                        <span>{data["Disease Name"]}</span>

                        <span className="font-medium text-muted-foreground">PubMed ID:</span>
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${data["PubMed ID"]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {data["PubMed ID"]}
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        <span className="font-medium text-muted-foreground">Sample:</span>
                        <span>{data.Sample}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Validation
                      </h3>
                      <Separator className="mb-4" />

                      <div className="grid grid-cols-[120px_1fr] gap-y-2">
                        <span className="font-medium text-muted-foreground">Method:</span>
                        <span>{data["Validated Method"]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col justify-start items-start">
  <div className="flex flex-col justify-start space-y-4">
    <h3 className="text-lg font-medium flex justify-start items-start gap-2 mb-2">
      <FileText className="h-5 w-5 text-primary" />
      Causality Information
    </h3>
    <Separator className="mb-4" />

    <div className="space-y-3 flex-col justify-start items-start">
      <div className="flex flex-col justify-start items-start"> {/* Aligns content to right */}
        <span className="font-medium text-muted-foreground block mb-1">Causality:</span>
        <p className="bg-muted/30 p-2 rounded-md text-left">{data.Causality}</p>
      </div>

      <div className="flex flex-col justify-start items-start">
        <span className="font-medium text-muted-foreground block mb-1">Causal Description:</span>
        <p className="bg-muted/30 p-2 rounded-md text-left">{data["Causal Description"]}</p>
      </div>

      <div className="flex flex-col justify-start items-start">
        <span className="font-medium text-muted-foreground block mb-1">Dysfunction Pattern:</span>
        <p className="bg-muted/30 p-2 rounded-md text-left">{data["Dysfunction Pattern"]}</p>
      </div>

      <div className="flex flex-col justify-start items-start">
        <span className="font-medium text-muted-foreground block mb-1">Description:</span>
        <p className="bg-muted/30 p-2 rounded-md text-left">{data.Description}</p>
      </div>
    </div>
  </div>
</div>
</div>
              </TabsContent>

              <TabsContent value="network">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Disease Association</CardTitle>
                    <CardDescription>List of all the associated diseases with {data["ncRNA Category"]}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0" ref={containerRef}>
                    {diseases.length > 0 ? diseases.map((item)=>{
                      return (
                        <div>
                          <p>{item}</p>
                        </div>
                      )
                    }): (
                      <div className="flex items-center justify-center h-[400px]">
                        <p className="text-muted-foreground">No associated diseases found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

               
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

