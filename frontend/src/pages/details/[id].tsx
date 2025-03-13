"use client"

import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Loader2 } from "lucide-react"
import ForceGraph2D from "react-force-graph-2d"

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

export default function NcRNADetails() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState<NcRNA | null>(null)
  const [diseases, setDiseases] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const graphRef = useRef<any>(null)

  // Fix the dependency array to avoid infinite loop
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/lncrna/details/${id}`)
        const result = await response.json()
        setData(result)

        // Only fetch diseases after we have the ncRNA data
        if (result && result["ncRNA Symbol"]) {
          fetchDiseases(result["ncRNA Symbol"])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const fetchDiseases = async (ncRNA: string) => {
    try {
      const response = await fetch(`http://localhost:4000/ncrna/${ncRNA}`)
      const result = await response.json()
      setDiseases(result)
    } catch (error) {
      console.error("Error fetching diseases:", error)
    }
  }

  // Prepare graph data
  const getGraphData = () => {
    if (!data || !diseases.length) return { nodes: [], links: [] }

    // Create center node for ncRNA
    const nodes = [{ id: data["ncRNA Symbol"], name: data["ncRNA Symbol"], group: "ncRNA", val: 20 }]

    // Add disease nodes
    diseases.forEach((disease) => {
      nodes.push({ id: disease, name: disease, group: "disease", val: 10 })
    })

    // Create links from ncRNA to each disease
    const links = diseases.map((disease) => ({
      source: data["ncRNA Symbol"],
      target: disease,
    }))

    return { nodes, links }
  }

  // Handle window resize for the graph
  useEffect(() => {
    const handleResize = () => {
      if (graphRef.current) {
        graphRef.current.d3Force("charge").strength(-120)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No data found for the given ID.</p>
      </div>
    )
  }

  const graphData = getGraphData()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{data["ncRNA Symbol"]} Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>
                  <strong>Disease Name:</strong> {data["Disease Name"]}
                </p>
                <p>
                  <strong>ncRNA Category:</strong> {data["ncRNA Category"]}
                </p>
                <p>
                  <strong>PubMed ID:</strong>{" "}
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${data["PubMed ID"]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {data["PubMed ID"]}
                  </a>
                </p>
                <p>
                  <strong>Species:</strong> {data.Species}
                </p>
                <p>
                  <strong>Causal Description:</strong> {data["Causal Description"]}
                </p>
                <p>
                  <strong>Causality:</strong> {data.Causality}
                </p>
                <p>
                  <strong>Description:</strong> {data.Description}
                </p>
                <p>
                  <strong>Dysfunction Pattern:</strong> {data.DysfunctionPattern}
                </p>
                <p>
                  <strong>Sample:</strong> {data.Sample}
                </p>
                <p>
                  <strong>Validated Method:</strong> {data.ValidatedMethod}
                </p>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-2">Associated Diseases</h3>
                <Card className="flex-1 overflow-hidden">
                  <CardContent className="p-0">
                    {diseases.length > 0 ? (
                      <div className="h-[400px] w-full">
                        <ForceGraph2D
                          ref={graphRef}
                          graphData={graphData}
                          nodeLabel="name"
                          nodeColor={(node) =>
                            node.group === "ncRNA" ? "var(--color-primary)" : "var(--color-accent)"
                          }
                          nodeRelSize={6}
                          linkWidth={2}
                          linkColor={() => "var(--color-muted)"}
                          cooldownTicks={100}
                          onEngineStop={() => graphRef.current?.zoomToFit(400)}
                          nodeCanvasObject={(node, ctx, globalScale) => {
                            const label = node.name
                            const fontSize = node.group === "ncRNA" ? 16 : 12
                            ctx.font = ${fontSize}px Sans-Serif
                            ctx.fillStyle = node.group === "ncRNA" ? "var(--color-primary)" : "var(--color-accent)"
                            ctx.beginPath()
                            ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI)
                            ctx.fill()

                            ctx.textAlign = "center"
                            ctx.textBaseline = "middle"
                            ctx.fillStyle = "#fff"
                            if (globalScale >= 1) {
                              ctx.fillText(label, node.x, node.y)
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px]">
                        <p className="text-muted-foreground">No associated diseases found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}