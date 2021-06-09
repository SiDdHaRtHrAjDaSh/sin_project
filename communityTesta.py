import networkx as nx
import community
# import matplotlib.pyplot as plt
import json

result_lst = []

def edge_to_remove(G):
    dict1 = nx.edge_betweenness_centrality(G)
    list_of_tuples = list(dict1.items())
    list_of_tuples.sort(key = lambda x:x[1], reverse = True)
    return list_of_tuples[0][0] #(a,b,)

def girvan(G):
    c = [G.subgraph(c) for c in nx.connected_components(G)]
    l = len(c)
    while(1):
        G.remove_edge(*edge_to_remove(G))
        c = [G.subgraph(c) for c in nx.connected_components(G)]
        #draw(G)
        result_lst.append(list([list(x) for x in list(G.edges())]))
        l = len(c)
        if(l == 15):
            break
    return c

def draw(G):

    #first compute the best partition
    partition = community.best_partition(G)

    #drawing
    size = float(len(set(partition.values())))
    pos = nx.spring_layout(G)
    count = 0.
    for com in set(partition.values()) :
        count = count + 1.
        list_nodes = [nodes for nodes in partition.keys()
                                    if partition[nodes] == com]
        nx.draw_networkx_nodes(G, pos, list_nodes, node_size = 20,
                                    node_color = str(count / size))


    nx.draw_networkx_edges(G, pos, alpha=0.5)
    # plt.show()

#G = nx.barbell_graph(5,0)
G = nx.karate_club_graph()
#G=nx.Graph()
#G.add_nodes_from([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
#G.add_edges_from([(1,2), (2,4),(1,3), (3,4),(2,3),(4,5), (5,6),(6,7),(6,8),(6,9),(5,7),(5,9),(4,15),(7,9),(10,9),(14,15),(14,10),(14,11),(15,12),(10,13),(12,13),(11,12)])
#draw(G)
result_lst.append(list([list(x) for x in list(G.edges())]))
c = girvan(G)
G1 = nx.Graph()

for i in range(len(c)):
    c[i] = nx.complement(c[i])
    G1.add_nodes_from(c[i].nodes())
    G1.add_edges_from(c[i].edges())




result_lst.append(list([list(x) for x in list(G1.edges())]))

print(json.dumps(result_lst))
sys.stdout.flush()
#draw(G1)

